import { Paper, Group, Text, Badge, Stack, Button, Menu } from '@mantine/core'
import { IconBook2, IconChevronDown, IconEdit, IconTrash, IconStar } from '@tabler/icons-react'
import { Link } from 'react-router'

const STATUS_COLORS = {
  'want-to-read': { backgroundColor: '#F9E0D3', color: '#454545' },
  'reading': { backgroundColor: '#d3e4ff', color: '#1c3a6e' },
  'completed': { backgroundColor: '#d3f9d8', color: '#1a4731' },
}

const STATUS_LABELS = {
  'want-to-read': 'Want to Read',
  'reading': 'Currently Reading',
  'completed': 'Completed',
}

export default function ReadingLogItem({ log, onEdit, onDelete }) {
  const book = log.book
  const coverUrl = book?.coverImage ||
    (book?.isbn ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg` : null)

  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      style={{ backgroundColor: '#FFFEFB', borderColor: '#F6EDDD' }}
    >
      <Group align="flex-start" gap="md">
        {/* Cover image */}
        <div style={{
          width: 60,
          height: 85,
          backgroundColor: 'transparent',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden',
          padding: 4,
        }}>
          {coverUrl ? (
            <>
              <img
                src={coverUrl}
                alt={book?.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  borderRadius: 3,
                }}
                onError={e => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <div style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                <IconBook2 size={24} color="#454545" opacity={0.3} />
              </div>
            </>
          ) : (
            <IconBook2 size={24} color="#454545" opacity={0.3} />
          )}
        </div>

        {/* Log info */}
        <Stack gap={4} style={{ flex: 1 }}>
          <Group justify="space-between" align="flex-start">
            <Stack gap={2}>
              <Text
                fw={600}
                component={Link}
                to={`/books/${book?._id}`}
                style={{ textDecoration: 'none', color: '#454545' }}
              >
                {book?.title || 'Unknown Book'}
              </Text>
              <Text size="sm" c="dimmed">{book?.author}</Text>
            </Stack>

            {/* Actions menu */}
            <Menu shadow="md" width={180} position="bottom-end">
              <Menu.Target>
                <Button
                  variant="subtle"
                  size="xs"
                  rightSection={<IconChevronDown size={12} />}
                  style={{ color: '#454545' }}
                >
                  Actions
                </Button>
              </Menu.Target>
              <Menu.Dropdown style={{ backgroundColor: '#FFFEFB', borderColor: '#F6EDDD' }}>
                <Menu.Item
                  leftSection={<IconEdit size={14} />}
                  onClick={() => onEdit(log)}
                >
                  Edit Log
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<IconTrash size={14} />}
                  onClick={() => onDelete(log)}
                >
                  Remove
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>

          <Group gap="sm" mt={4}>
            <Badge
              size="sm"
              style={STATUS_COLORS[log.status] || STATUS_COLORS['want-to-read']}
            >
              {STATUS_LABELS[log.status] || log.status}
            </Badge>

            {log.rating && (
              <Group gap={2}>
                <IconStar size={14} color="#f59f00" fill="#f59f00" />
                <Text size="sm" fw={500}>{log.rating}/5</Text>
              </Group>
            )}

            {log.status === 'reading' && log.progress > 0 && (
              <Text size="sm" c="dimmed">Page {log.progress}</Text>
            )}
          </Group>

          {log.review && (
            <Text size="sm" c="dimmed" mt={4} lineClamp={2} style={{ fontStyle: 'italic' }}>
              "{log.review}"
            </Text>
          )}
        </Stack>
      </Group>
    </Paper>
  )
}