import { Outlet, Link, useNavigate } from 'react-router'
import { AppShell, Group, Button, Text, Container, Burger, Drawer, Stack } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconBook2 } from '@tabler/icons-react'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [opened, { toggle, close }] = useDisclosure(false)

  function handleLogout() {
    logout()
    navigate('/')
    close()
  }

  const navLinks = (
    <>
      <Button variant="subtle" component={Link} to="/" onClick={close}>Books</Button>
      {user && <Button variant="subtle" component={Link} to="/logs" onClick={close}>My Logs</Button>}
      {user && <Button variant="subtle" component={Link} to="/shelves" onClick={close}>My Shelves</Button>}
    </>
  )

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group h="100%" justify="space-between">
            <Group gap="xs">
              <IconBook2 size={28} color="#6741d9" />
              <Text fw={700} size="lg" component={Link} to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                Reading Tracker
              </Text>
            </Group>

            {/* Desktop nav */}
            <Group visibleFrom="sm">
              {navLinks}
              {user ? (
                <Button variant="light" color="red" onClick={handleLogout}>Logout</Button>
              ) : (
                <Group gap="xs">
                  <Button variant="subtle" component={Link} to="/login">Login</Button>
                  <Button component={Link} to="/register">Register</Button>
                </Group>
              )}
            </Group>

            {/* Mobile burger */}
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" />
          </Group>
        </Container>
      </AppShell.Header>

      {/* Mobile drawer */}
      <Drawer opened={opened} onClose={close} title="Menu" hiddenFrom="sm">
        <Stack>
          {navLinks}
          {user ? (
            <Button color="red" onClick={handleLogout}>Logout</Button>
          ) : (
            <>
              <Button variant="subtle" component={Link} to="/login" onClick={close}>Login</Button>
              <Button component={Link} to="/register" onClick={close}>Register</Button>
            </>
          )}
        </Stack>
      </Drawer>

      <AppShell.Main>
        <Container size="lg">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}