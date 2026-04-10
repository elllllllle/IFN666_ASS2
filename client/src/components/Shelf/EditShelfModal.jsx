import { useState, useEffect } from 'react'
import { Modal, TextInput, Button, Stack, Group, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useAuth } from '../../context/AuthContext'

export default function EditShelfModal({ opened, onClose, shelf, onUpdated }) {
  const { token } = useAuth()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (shelf) setName(shelf.name)
  }, [shelf, opened])

  async function handleSubmit() {
    setError(null)
    if (!name.trim()) return setError('Shelf name is required')

    setLoading(true)
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/shelves/${shelf._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update shelf')
      notifications.show({
        title: 'Shelf updated!',
        message: `Shelf name updated to "${name}".`,
        color: 'green',
      })
      onUpdated(data)
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
      title="Edit shelf name"
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
          value={name}
          onChange={e => setName(e.target.value)}
          required
          styles={{ input: { backgroundColor: '#FFFEFB', borderColor: '#F6EDDD' } }}
        />
        <Group justify="flex-end" mt="sm">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} loading={loading}>Save</Button>
        </Group>
      </Stack>
    </Modal>
  )
}