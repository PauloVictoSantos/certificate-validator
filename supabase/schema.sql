-- Rode no SQL Editor do Supabase.

create table if not exists cursos (
  id serial primary key,
  nome text not null unique,
  carga_horaria int not null check (carga_horaria > 0)
);

-- Codigos gerados (reservados ou ja usados). Alfabeto sem 0, O, 1, I, L.
create table if not exists codigos (
  codigo text primary key check (codigo ~ '^[2-9A-HJKMNP-Z]{8}$'),
  reservado_em timestamptz not null default now()
);

-- Certificados nunca sao excluidos, apenas revogados.
create table if not exists certificados (
  codigo text primary key references codigos (codigo),
  nome_aluno text not null,
  curso_id int not null references cursos (id),
  data_conclusao date not null,
  emitido_em timestamptz not null default now(),
  status text not null default 'valido' check (status in ('valido', 'revogado')),
  revogado_em timestamptz
);

create index if not exists certificados_emitido_em_idx on certificados (emitido_em desc);
create index if not exists certificados_status_idx on certificados (status);
create index if not exists certificados_curso_idx on certificados (curso_id);

-- RLS: o servidor usa a service role (ignora RLS). Anon so le "cursos"
-- (necessario para o workflow que mantem o projeto ativo).
alter table cursos enable row level security;
alter table codigos enable row level security;
alter table certificados enable row level security;

drop policy if exists "cursos_leitura_publica" on cursos;
create policy "cursos_leitura_publica" on cursos
  for select to anon, authenticated using (true);

insert into cursos (nome, carga_horaria) values
  ('Product Design Essentials', 24),
  ('Front-end Development', 40),
  ('Data Analysis with Python', 32),
  ('Project Management', 20),
  ('UX Research Fundamentals', 18)
on conflict (nome) do nothing;
