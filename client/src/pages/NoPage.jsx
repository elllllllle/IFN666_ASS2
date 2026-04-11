import { Stack, Title, Text, Button } from '@mantine/core'
import { Link } from 'react-router'
import { IconBook2 } from '@tabler/icons-react'

export default function NoPage() {
  return (
    <Stack align="center" justify="center" gap="md" py={80}>
      <IconBook2 size={64} color="#454545" opacity={0.3} />
      <Title order={2}>Page Not Found</Title>
      <Text c="dimmed" size="sm" ta="center" maw={400}>
        Oops! The page you're looking for doesn't exist. 
        It might have been moved or the URL may be incorrect.
      </Text>
      <Button component={Link} to="/" mt="sm">
        Back to Home
      </Button>
    </Stack>
  )
}