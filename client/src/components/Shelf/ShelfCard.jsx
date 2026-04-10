import { Paper, Text, Group, ActionIcon, Menu } from '@mantine/core'
import { IconBooks, IconDotsVertical, IconTrash, IconPencil } from '@tabler/icons-react'

export default function ShelfCard({ shelf, onClick, onDelete, onEdit }) {
  return (
    <Paper
      withBorder
      p="lg"
      radius="md"
      style={{
        backgroundColor: '#FFFEFB',
        borderColor: '#F6EDDD',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
      onClick={onClick}
    >
      <Group justify="space-between" align="flex-start">
        <Group gap="sm">
          <IconBooks size={24} color="#454545" opacity={0.6} />
          <div>
            <Text fw={600}>{shelf.name}</Text>
            <Text size="sm" c="dimmed">
              {shelf.books?.length || 0} {shelf.books?.length === 1 ? 'book' : 'books'}
            </Text>
          </div>
        </Group>

        <Menu shadow="md" width={180} position="bottom-end">
          <Menu.Target>
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={e => e.stopPropagation()}
            >
              <IconDotsVertical size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown style={{ backgroundColor: '#FFFEFB', borderColor: '#F6EDDD' }}>
            <Menu.Item
              leftSection={<IconPencil size={14} />}
              onClick={e => {
                e.stopPropagation()
                onEdit(shelf)
              }}
            >
              Edit Shelf Name
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              color="red"
              leftSection={<IconTrash size={14} />}
              onClick={e => {
                e.stopPropagation()
                onDelete(shelf)
              }}
            >
              Delete Shelf
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Paper>
  )
}