import { useState } from 'react'
import { TextInput, PasswordInput, Button, Paper, Title, Text, Anchor, Stack, Alert } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!form.username.trim()) return setError('Username is required')
    if (!form.email.trim()) return setError('Email is required')
    if (!form.email.includes('@')) return setError('Enter a valid email address')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')

    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.errors && data.errors.length > 0) {
          throw new Error(data.errors[0].msg)
        }
        throw new Error(data.error || 'Registration failed')
      }

      // Auto-login after register
      const loginRes = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password }),
      })
      const loginData = await loginRes.json()
      if (loginRes.ok) {
        const userData = { username: form.username }
        login(userData, loginData.authToken)
        navigate('/')
      } else {
        navigate('/login')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper withBorder shadow="sm" p="xl" mt="xl" maw={420} mx="auto" radius="md">
      <Title order={2} mb="xs">Create an account</Title>
      <Text c="dimmed" size="sm" mb="lg">
        Already have an account?{' '}
        <Anchor component={Link} to="/login">Login</Anchor>
      </Text>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Username"
            name="username"
            placeholder="Letters, numbers, underscores, hyphens"
            value={form.username}
            onChange={handleChange}
            required
          />
          <TextInput
            label="Email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          <PasswordInput
            label="Password"
            name="password"
            placeholder="At least 6 characters"
            value={form.password}
            onChange={handleChange}
            required
          />
          <Button type="submit" loading={loading} fullWidth mt="sm">
            Create account
          </Button>
        </Stack>
      </form>
    </Paper>
  )
}