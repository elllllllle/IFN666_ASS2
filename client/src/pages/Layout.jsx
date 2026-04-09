import { Outlet, Link, useNavigate } from 'react-router'
import {
  AppShell, Group, Button, Text, Container, Burger,
  Drawer, Stack, Divider, ScrollArea, Box
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconBook2 } from '@tabler/icons-react'
import { useAuth } from '../context/AuthContext'

const BRAND = '#454545'
const BRAND_HOVER = '#FFFBE9'
const BRAND_BTN_HOVER = '#353431'
const NAV_BG = '#FFFDF5'

const linkStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '0 16px',
  height: '100%',
  color: BRAND,
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 500,
  transition: 'background-color 0.15s ease',
}

const primaryBtn = {
  backgroundColor: BRAND,
  color: 'white',
  border: 'none',
}

const primaryBtnHover = {
  backgroundColor: BRAND_BTN_HOVER,
  color: 'white',
  border: 'none',
}

const outlineBtn = {
  backgroundColor: 'transparent',
  color: BRAND,
  border: `1.5px solid ${'#F6EDDD'}`,
}

const outlineBtnHover = {
  backgroundColor: '#F6EDDD',
  color: BRAND,
  border: `1.5px solid ${'#F6EDDD'}`,
}

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [opened, { toggle, close }] = useDisclosure(false)

  function handleLogout() {
    logout()
    navigate('/')
    close()
  }

  function NavLink({ to, children, onClick }) {
    return (
      <Box
        component={Link}
        to={to}
        onClick={onClick}
        style={linkStyle}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = BRAND_HOVER}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        {children}
      </Box>
    )
  }

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header style={{ backgroundColor: NAV_BG, borderBottom: `1px solid #F6EDDD` }}>
        <Container size="lg" h="100%">
          <Group h="100%" justify="space-between">

            {/* Logo */}
            <Group gap="xs">
              <IconBook2 size={28} color={BRAND} />
              <Text
                fw={700}
                size="lg"
                component={Link}
                to="/"
                style={{ textDecoration: 'none', color: BRAND }}
              >
                Reading Tracker
              </Text>
            </Group>

            {/* Desktop nav — only shown when logged in */}
            <Group h="100%" gap={0} visibleFrom="sm">
              {user && <NavLink to="/">Books</NavLink>}
              {user && <NavLink to="/logs">My Logs</NavLink>}
              {user && <NavLink to="/shelves">My Shelves</NavLink>}
            </Group>

            {/* Desktop auth buttons */}
            <Group visibleFrom="sm">
              {user ? (
                <Group gap="xs">
                  <Text size="sm" style={{ color: BRAND }}>
                    Hi, {user.username}
                  </Text>
                  <Button
                    size="sm"
                    onClick={handleLogout}
                    style={primaryBtn}
                    onMouseEnter={e => Object.assign(e.currentTarget.style, primaryBtnHover)}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, primaryBtn)}
                  >
                    Logout
                  </Button>
                </Group>
              ) : (
                <Group gap="xs">
                  <Button
                    size="sm"
                    component={Link}
                    to="/login"
                    style={outlineBtn}
                    onMouseEnter={e => Object.assign(e.currentTarget.style, outlineBtnHover)}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, outlineBtn)}
                  >
                    Log in
                  </Button>
                  <Button
                    size="sm"
                    component={Link}
                    to="/register"
                    style={primaryBtn}
                    onMouseEnter={e => Object.assign(e.currentTarget.style, primaryBtnHover)}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, primaryBtn)}
                  >
                    Sign up
                  </Button>
                </Group>
              )}
            </Group>

            {/* Mobile burger */}
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" color={BRAND} />
          </Group>
        </Container>
      </AppShell.Header>

      {/* Mobile drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        size="100%"
        padding="md"
        title={
          <Group gap="xs">
            <IconBook2 size={20} color={BRAND} />
            <Text fw={700} style={{ color: BRAND }}>Reading Tracker</Text>
          </Group>
        }
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px)" mx="-md">
          <Divider my="sm" />
          <Stack px="md" gap={0}>
            {user && <NavLink to="/" onClick={close}>Books</NavLink>}
            {user && <NavLink to="/logs" onClick={close}>My Logs</NavLink>}
            {user && <NavLink to="/shelves" onClick={close}>My Shelves</NavLink>}
          </Stack>
          <Divider my="sm" />
          <Group justify="center" grow pb="xl" px="md">
            {user ? (
              <Button
                onClick={handleLogout}
                style={primaryBtn}
                onMouseEnter={e => Object.assign(e.currentTarget.style, primaryBtnHover)}
                onMouseLeave={e => Object.assign(e.currentTarget.style, primaryBtn)}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  onClick={close}
                  style={outlineBtn}
                  onMouseEnter={e => Object.assign(e.currentTarget.style, outlineBtnHover)}
                  onMouseLeave={e => Object.assign(e.currentTarget.style, outlineBtn)}
                >
                  Log in
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  onClick={close}
                  style={primaryBtn}
                  onMouseEnter={e => Object.assign(e.currentTarget.style, primaryBtnHover)}
                  onMouseLeave={e => Object.assign(e.currentTarget.style, primaryBtn)}
                >
                  Sign up
                </Button>
              </>
            )}
          </Group>
        </ScrollArea>
      </Drawer>

      <AppShell.Main>
        <Container size="lg">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}