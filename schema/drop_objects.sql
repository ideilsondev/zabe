-- =================================================================
-- INÍCIO: SEÇÃO DE LIMPEZA GERAL (DROP OBJETOS EXISTENTES)
-- =================================================================
DO $$ BEGIN PERFORM 'DROP POLICY IF EXISTS ' || policyname || ' ON public.' || tablename || ';'
FROM pg_policies
WHERE schemaname = 'public';
END $$;
DROP FUNCTION IF EXISTS public.fn_audit_trigger() CASCADE;
DROP FUNCTION IF EXISTS public.check_permission(bigint, text) CASCADE;
DROP FUNCTION IF EXISTS public.get_user_permissions(uuid, bigint) CASCADE;
DROP FUNCTION IF EXISTS public.generate_tenant_code() CASCADE;
DROP FUNCTION IF EXISTS public.generate_tag_code() CASCADE;
DROP FUNCTION IF EXISTS public.get_current_user_role() CASCADE;
DROP FUNCTION IF EXISTS public.get_role_level(text) CASCADE;
DROP FUNCTION IF EXISTS public.is_higher_role(text) CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.create_profile_for_new_user() CASCADE;
-- ============================================================
DROP TABLE IF EXISTS public.collection_errors CASCADE;
DROP TABLE IF EXISTS public.reading_summaries CASCADE;
DROP TABLE IF EXISTS public.readings CASCADE;
DROP TABLE IF EXISTS public.indicators CASCADE;
DROP TABLE IF EXISTS public.sessions CASCADE;
DROP TABLE IF EXISTS public.sector_responsibles CASCADE;
DROP TABLE IF EXISTS public.trips CASCADE;
DROP TABLE IF EXISTS public.readers CASCADE;
DROP TABLE IF EXISTS public.sectors CASCADE;
DROP TABLE IF EXISTS public.vehicles CASCADE;
DROP TABLE IF EXISTS public.tags CASCADE;
DROP TABLE IF EXISTS public.api_keys CASCADE;
DROP TABLE IF EXISTS public.devices CASCADE;
DROP TABLE IF EXISTS public.dashboards CASCADE;
DROP TABLE IF EXISTS public.data CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.user_tenant_groups CASCADE;
DROP TABLE IF EXISTS public.tenant_groups CASCADE;
DROP TABLE IF EXISTS public.blocked_users CASCADE;
DROP TABLE IF EXISTS public.services_tenants CASCADE;
DROP TABLE IF EXISTS public.user_tenants CASCADE;
DROP TABLE IF EXISTS public.bank_accounts CASCADE;
DROP TABLE IF EXISTS public.contacts CASCADE;
DROP TABLE IF EXISTS public.addresses CASCADE;
DROP TABLE IF EXISTS public.tenant_characteristics CASCADE;
DROP TABLE IF EXISTS public.tenants CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.tenant_types CASCADE;