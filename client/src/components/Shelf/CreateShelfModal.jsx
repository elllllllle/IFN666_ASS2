import { useState } from 'react'
import { Modal, TextInput, Button, Stack, Group, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useAuth } from '../../context/AuthContext'

export default function CreateShelfModal({ opened, onClose, onCreated }) {
  const { token } = useAuth()
  const [form, setForm] = useState({ name: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit() {
    setError(null)
    if (!form.name.trim()) return setError('Shelf name is required')

    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/shelves`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: form.name, isPublic: false }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create shelf')
      notifications.show({
        title: 'Shelf created!',
        message: `"${form.name}" has been created.`,
        color: 'green',
      })
      setForm({ name: '' })
      onCreated(data)
      onClose()
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.message,
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Create a new shelf"
      styles={{
        content: { backgroundColor: '#FFFEFB' },
        header: { backgroundColor: '#FFFEFB' },
      }}
    >
      <Stack>
        {error && <Text size="sm" c="red">{error}</Text>}
        <TextInput
          label="Shelf name"
          placeholder="e.g. Beach Reads, Favourites..."
          value={form.name}
          onChange={e => setForm({ name: e.target.value })}
          required
          styles={{ input: { backgroundColor: '#FFFEFB', borderColor: '#F6EDDD' } }}
        />
        <Group justify="flex-end" mt="sm">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} loading={loading}>Create Shelf</Button>
        </Group>
      </Stack>
    </Modal>
  )
}