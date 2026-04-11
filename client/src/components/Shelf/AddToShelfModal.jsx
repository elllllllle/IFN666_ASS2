import { useState, useEffect } from 'react'
import { Modal, Button, Stack, Text, Group, Radio } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useAuth } from '../../context/AuthContext'

export default function AddToShelfModal({ opened, onClose, book }) {
  const { token } = useAuth()
  const [shelves, setShelves] = useState([])
  const [selectedShelf, setSelectedShelf] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    if (opened) fetchShelves()
  }, [opened])

  async function fetchShelves() {
    setFetching(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/shelves`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) setShelves(data)
    } catch {
      // silently fail
    } finally {
      setFetching(false)
    }
  }

  async function handleSubmit() {
    if (!selectedShelf) return
    setLoading(true)
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/shelves/${selectedShelf}/books`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ bookId: book._id }),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to add to shelf')
      notifications.show({
        title: 'Added to shelf!',
        message: `"${book.title}" has been added to your shelf.`,
        color: 'green',
      })
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
      title={`Add "${book?.title}" to a shelf`}
      styles={{
        content: { backgroundColor: '#FFFEFB' },
        header: { backgroundColor: '#FFFEFB' },
      }}
    >
      <Stack>
        {fetching ? (
          <Text size="sm" c="dimmed">Loading shelves...</Text>
        ) : shelves.length === 0 ? (
          <Text size="sm" c="dimmed">
            You don't have any shelves yet. Create one from My Books page first!
          </Text>
        ) : (
          <Radio.Group
            value={selectedShelf}
            onChange={setSelectedShelf}
            label="Select a shelf"
          >
            <Stack gap="xs" mt="xs">
              {shelves.map(shelf => (
                <Radio
                  key={shelf._id}
                  value={shelf._id}
                  label={`${shelf.name} (${shelf.books?.length || 0} books)`}
                  styles={{
                    label: { color: '#454545' },
                  }}
                />
              ))}
            </Stack>
          </Radio.Group>
        )}

        <Group justify="flex-end" mt="sm">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={!selectedShelf || shelves.length === 0}
          >
            Add to Shelf
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}