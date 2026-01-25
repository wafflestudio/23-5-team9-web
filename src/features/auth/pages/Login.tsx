import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { authApi } from '@/features/auth/api/auth';
import { PageContainer } from '@/shared/layouts/PageContainer';
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Title,
  Text,
  Anchor,
  Container,
  Alert,
  Group,
} from '@mantine/core';
import { GoogleIcon } from '@/shared/components';
import { useTranslation } from '@/shared/i18n';
import { useLogin } from '../hooks/useLogin';
import { loginSchema, type LoginForm } from '../api/schemas';

export default function Login() {
  const { login, serverError } = useLogin();
  const t = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <PageContainer>
      <Container size="xs" mt="xl" px={0}>
        <Title order={2} mb="lg" c="slate.9">
          {t.auth.login}
        </Title>

        <form onSubmit={handleSubmit(login)}>
          <Stack gap="sm">
            <TextInput
              type="email"
              placeholder={t.auth.email}
              {...register('email')}
              error={errors.email?.message}
            />

            <PasswordInput
              placeholder={t.auth.password}
              {...register('password')}
              error={errors.password?.message}
            />

            <Button
              type="submit"
              loading={isSubmitting}
              color="brand"
              fullWidth
              mt="sm"
              size="md"
            >
              {isSubmitting ? t.auth.loggingIn : t.auth.login}
            </Button>

            {serverError && (
              <Alert color="red" variant="light">
                <Text ta="center" size="sm" fw={500} c="red">
                  {serverError}
                </Text>
              </Alert>
            )}
          </Stack>
        </form>

        <Button
          onClick={() => (window.location.href = authApi.getGoogleLoginUrl())}
          variant="outline"
          color="gray"
          fullWidth
          mt="lg"
          leftSection={<GoogleIcon />}
        >
          {t.auth.continueWithGoogle}
        </Button>

        <Group justify="center" mt="lg" gap="xs">
          <Text size="sm" c="slate.5">
            {t.auth.noAccount}
          </Text>
          <Anchor component={Link} to="/auth/signup" fw={600} c="brand.5">
            {t.auth.signup}
          </Anchor>
        </Group>
      </Container>
    </PageContainer>
  );
}
