import { Card, Text, Badge, Group, Stack } from '@mantine/core'
import { Link } from 'react-router'
import { IconBook2 } from '@tabler/icons-react'

export default function BookCard({ book }) {
  return (
    <Card
      component={Link}
      to={`/books/${book._id}`}
      withBorder
      radius="md"
      padding="lg"
      style={{
        backgroundColor: '#FFFEFB',
        borderColor: '#F6EDDD',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
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
    >
      {/* Cover image or placeholder */}
      <Card.Section
        style={{
          backgroundColor: '#F6EDDD',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 160,
        }}
      >
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <IconBook2 size={48} color="#454545" opacity={0.3} />
        )}
      </Card.Section>

      <Stack gap={6} mt="md" style={{ flex: 1 }}>
        <Text fw={600} size="sm" lineClamp={2} style={{ color: '#454545' }}>
          {book.title}
        </Text>
        <Text size="xs" c="dimmed" lineClamp={1}>
          {book.author}
        </Text>
        {book.genre && (
          <Badge
            variant="light"
            size="sm"
            mt="auto"
            style={{ backgroundColor: '#F6EDDD', color: '#454545', alignSelf: 'flex-start' }}
          >
            {book.genre}
          </Badge>
        )}
      </Stack>
    </Card>
  )
}