import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Checkbox } from '../../components/ui';
import { SocialLoginButton, Divider } from '../../components/auth';
import { MOCK_USERS } from '../../_mock/mockUsers';
import { storage } from '../../utils';
import { paths } from '../../routes/paths';

/**
 * Login Form - Formularul de autentificare
 * RESPONSIVE: Full width pe mobile, 1/2 pe desktop
 */