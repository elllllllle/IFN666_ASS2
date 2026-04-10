import { useState, useEffect } from 'react'
import {
  Stack, Title, Text, Select, Group,
  Loader, Center, Alert, Button
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconAlertCircle, IconAdjustments } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { useAuth } from '../context/AuthContext'
import ReadingLogItem from '../components/ReadingLog/ReadingLogItem'
import LogModal from '../components/ReadingLog/AddToLogModal'

const STATUS_OPTIONS = [
  { value: '', label: 'All Books' },
  { value: 'want-to-read', label: 'Want to Read' },
  { value: 'reading', label: 'Currently Reading' },
  { value: 'completed', label: 'Completed' },
]

export default function MyLogs() {
  const { token } = useAuth()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedLog, setSelectedLog] = useState(null)
  const [modalOpened, { open, close }] = useDisclosure(false)

  useEffect(() => {
    fetchLogs()
  }, [statusFilter])

  async function fetchLogs() {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams()
    if (statusFilter) params.append('status', statusFilter)
    params.append('limit', 50)

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/reading-logs?${params}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch logs')
      setLogs(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(log) {
    setSelectedLog(log)
    open()
  }

  async function handleDelete(log) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/reading-logs/${log._id}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )
      if (!res.ok) throw new Error('Failed to remove log')
      setLogs(prev => prev.filter(l => l._id !== log._id))
      notifications.show({
        title: 'Removed',
        message: `"${log.book?.title}" removed from your logs.`,
        color: 'orange',
      })
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.message,
        color: 'red',
      })
    }
  }

  function handleModalClose() {
    close()
    setSelectedLog(null)
    fetchLogs()
  }

  const counts = {
    all: logs.length,
    reading: logs.filter(l => l.status === 'reading').length,
    completed: logs.filter(l => l.status === 'completed').length,
    'want-to-read': logs.filter(l => l.status === 'want-to-read').length,
  }

  return (
    <Stack gap="lg" py="md">
      {/* Header */}
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2}>My Reading Logs</Title>
          <Text c="dimmed" size="sm" mt={4}>
            {counts.all} books · {counts.reading} reading · {counts.completed} completed
          </Text>
        </div>
        <Select
          placeholder="Filter by status"
          leftSection={<IconAdjustments size={16} />}
          data={STATUS_OPTIONS}
          value={statusFilter}
          onChange={val => setStatusFilter(val || '')}
          w={200}
          styles={{
            input: { backgroundColor: '#FFFEFB', borderColor: '#F6EDDD' }
          }}
        />
      </Group>

      {/* Content */}
      {loading ? (
        <Center py="xl">
          <Loader color="#454545" />
        </Center>
      ) : error ? (
        <Alert icon={<IconAlertCircle size={16} />} color="red">
          {error}
        </Alert>
      ) : logs.length === 0 ? (
        <Center py="xl">
          <Stack align="center" gap="sm">
            <Text c="dimmed">
              {statusFilter ? 'No books with this status' : 'No books in your reading log yet'}
            </Text>
            {statusFilter && (
              <Button variant="outline" onClick={() => setStatusFilter('')}>
                Show all
              </Button>
            )}
          </Stack>
        </Center>
      ) : (
        <Stack gap="sm">
          {logs.map(log => (
            <ReadingLogItem
              key={log._id}
              log={log}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </Stack>
      )}

      {/* Edit modal */}
      {selectedLog && (
        <LogModal
          opened={modalOpened}
          onClose={handleModalClose}
          book={selectedLog.book}
          logEntry={selectedLog}
        />
      )}
    </Stack>
  )
}