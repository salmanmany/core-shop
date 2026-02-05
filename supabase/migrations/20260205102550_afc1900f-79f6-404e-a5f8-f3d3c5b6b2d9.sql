-- First migration: Add seller to enum (must be committed separately)
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'seller';