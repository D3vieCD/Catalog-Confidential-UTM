import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { paths } from '../../routes/paths';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { storage } from '../../utils';

/**
 * Sidebar - Navigare principală cu hover expand
 * Include meniu complet, logout cu modală și animații smooth
 */