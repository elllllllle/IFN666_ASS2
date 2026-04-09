import { useState } from 'react'
import { TextInput, PasswordInput, Button, Paper, Title, Text, Anchor, Stack, Alert } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!form.username.trim()) return setError('Username is required')
    if (!form.password) return setError('Password is required')

    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      const userData = { username: form.username }
      login(userData, data.authToken)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper withBorder p="xl" radius="md" w="100%" maw={420}
        style={{
        backgroundColor: '#FFFEFB',
        borderColor: '#F6EDDD',
        }}>
        <Title order={2} mb="xs">Welcome back !</Title>
        <Text size="sm" mb="lg">
          Don't have an account?{' '}
          <Anchor component={Link} to="/register" fw={600}>
            Register
          </Anchor>
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
              placeholder="Your username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <PasswordInput
              label="Password"
              name="password"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <Button type="submit" loading={loading} fullWidth mt="sm">
              Login
            </Button>
          </Stack>
        </form>
      </Paper>
    </div>
  )
}