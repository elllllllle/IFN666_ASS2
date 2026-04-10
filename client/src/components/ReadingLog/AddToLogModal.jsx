import { useState, useEffect } from 'react'
import { Modal, Select, NumberInput, Textarea, Button, Stack, Group } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useAuth } from '../../context/AuthContext'

export default function LogModal({ opened, onClose, book, logEntry }) {
  const { token } = useAuth()
  const isEditing = !!logEntry
  const [form, setForm] = useState({
    status: 'want-to-read',
    progress: 0,
    rating: '',
    review: '',
  })
  const [loading, setLoading] = useState(false)

  // Pre-fill form when editing
  useEffect(() => {
    if (logEntry) {
      setForm({
        status: logEntry.status || 'want-to-read',
        progress: logEntry.progress || 0,
        rating: logEntry.rating ? String(logEntry.rating) : '',
        review: logEntry.review || '',
      })
    } else {
      setForm({ status: 'want-to-read', progress: 0, rating: '', review: '' })
    }
  }, [logEntry, opened])

  async function handleSubmit() {
    setLoading(true)
    try {
      const url = isEditing
        ? `${import.meta.env.VITE_API_URL}/reading-logs/${logEntry._id}`
        : `${import.meta.env.VITE_API_URL}/reading-logs`
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          book: book._id,
          status: form.status,
          progress: form.progress || 0,
          rating: form.rating ? Number(form.rating) : undefined,
          review: form.review || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to save reading log')

      notifications.show({
        title: isEditing ? 'Log updated!' : 'Added to reading log!',
        message: isEditing
          ? `"${book.title}" log has been updated.`
          : `"${book.title}" has been added to your reading log.`,
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
      title={isEditing
        ? `Edit log for "${book?.title}"`
        : `Add "${book?.title}" to reading log`
      }
      styles={{
        content: { backgroundColor: '#FFFEFB' },
        header: { backgroundColor: '#FFFEFB' },
      }}
    >
      <Stack>
        <Select
          label="Reading status"
          value={form.status}
          onChange={val => val && setForm({ ...form, status: val })}
          allowDeselect={false}
          data={[
            { value: 'want-to-read', label: 'Want to Read' },
            { value: 'reading', label: 'Currently Reading' },
            { value: 'completed', label: 'Completed' },
          ]}
          styles={{ input: { backgroundColor: '#FFFEFB', borderColor: '#F6EDDD' } }}
        />
        {form.status === 'reading' && (
          <NumberInput
            label="Progress (pages read)"
            value={form.progress}
            onChange={val => setForm({ ...form, progress: val })}
            min={0}
            styles={{ input: { backgroundColor: '#FFFEFB', borderColor: '#F6EDDD' } }}
          />
        )}
        {form.status === 'completed' && (
          <Select
            label="Rating"
            placeholder="Rate this book"
            value={form.rating ? String(form.rating) : ''}
            onChange={val => setForm({ ...form, rating: val })}
            data={[
              { value: '1', label: '⭐ 1 - Poor' },
              { value: '2', label: '⭐⭐ 2 - Fair' },
              { value: '3', label: '⭐⭐⭐ 3 - Good' },
              { value: '4', label: '⭐⭐⭐⭐ 4 - Great' },
              { value: '5', label: '⭐⭐⭐⭐⭐ 5 - Amazing' },
            ]}
            styles={{ input: { backgroundColor: '#FFFEFB', borderColor: '#F6EDDD' } }}
          />
        )}
        {form.status === 'completed' && (
          <Textarea
            label="Review"
            placeholder="Write your thoughts about this book..."
            value={form.review}
            onChange={e => setForm({ ...form, review: e.target.value })}
            rows={3}
            styles={{ input: { backgroundColor: '#FFFEFB', borderColor: '#F6EDDD' } }}
          />
        )}
        <Group justify="flex-end" mt="sm">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} loading={loading}>
            {isEditing ? 'Update Log' : 'Add to Log'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}