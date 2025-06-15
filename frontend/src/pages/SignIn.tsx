import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../components/ui/toast';
import { motion } from 'framer-motion';
import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return <SignIn />;
}
