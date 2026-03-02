import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login, Register, Dashboard, Calendar, Settings, Students, Groups, Catalog, GroupCatalog, Reports } from '../pages';
import { Page403, Page404, Page500 } from '../pages/error';
import { DashboardLayout } from '../layouts/dashboard/DashboardLayout';
import { storage } from '../utils';
import { paths } from './paths';