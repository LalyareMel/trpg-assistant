-- TRPG助手数据库初始化脚本
-- 在Supabase SQL编辑器中运行此脚本

-- 启用UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. 用户表
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户表索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- 用户表RLS策略
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- 2. 角色卡表
-- ============================================
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  game_system TEXT NOT NULL CHECK (game_system IN ('COC', 'DND', 'GENERIC')),
  data JSONB NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 角色卡表索引
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);
CREATE INDEX IF NOT EXISTS idx_characters_game_system ON characters(game_system);
CREATE INDEX IF NOT EXISTS idx_characters_is_public ON characters(is_public);

-- 角色卡表RLS策略
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own and public characters" ON characters
  FOR SELECT USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Users can insert own characters" ON characters
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own characters" ON characters
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own characters" ON characters
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 3. 房间表
-- ============================================
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  game_system TEXT NOT NULL CHECK (game_system IN ('COC', 'DND', 'GENERIC')),
  gm_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 房间表索引
CREATE INDEX IF NOT EXISTS idx_rooms_gm_id ON rooms(gm_id);
CREATE INDEX IF NOT EXISTS idx_rooms_is_active ON rooms(is_active);

-- 房间表RLS策略
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active rooms" ON rooms
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "GM can insert rooms" ON rooms
  FOR INSERT WITH CHECK (auth.uid() = gm_id);

CREATE POLICY "GM can update own rooms" ON rooms
  FOR UPDATE USING (auth.uid() = gm_id);

CREATE POLICY "GM can delete own rooms" ON rooms
  FOR DELETE USING (auth.uid() = gm_id);

-- ============================================
-- 4. 房间成员表
-- ============================================
CREATE TABLE IF NOT EXISTS room_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'player' CHECK (role IN ('gm', 'player')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- 房间成员表索引
CREATE INDEX IF NOT EXISTS idx_room_members_room_id ON room_members(room_id);
CREATE INDEX IF NOT EXISTS idx_room_members_user_id ON room_members(user_id);

-- 房间成员表RLS策略
ALTER TABLE room_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Room members can view members" ON room_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM room_members rm
      WHERE rm.room_id = room_members.room_id
      AND rm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join rooms" ON room_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave rooms" ON room_members
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 5. 骰子记录表
-- ============================================
CREATE TABLE IF NOT EXISTS dice_rolls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expression TEXT NOT NULL,
  results INTEGER[] NOT NULL,
  total INTEGER NOT NULL,
  game_system TEXT,
  check_type TEXT,
  success BOOLEAN,
  critical_success BOOLEAN,
  critical_failure BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 骰子记录表索引
CREATE INDEX IF NOT EXISTS idx_dice_rolls_room_id ON dice_rolls(room_id);
CREATE INDEX IF NOT EXISTS idx_dice_rolls_user_id ON dice_rolls(user_id);
CREATE INDEX IF NOT EXISTS idx_dice_rolls_created_at ON dice_rolls(created_at DESC);

-- 骰子记录表RLS策略
ALTER TABLE dice_rolls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Room members can view dice rolls" ON dice_rolls
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM room_members rm
      WHERE rm.room_id = dice_rolls.room_id
      AND rm.user_id = auth.uid()
    )
  );

CREATE POLICY "Room members can insert dice rolls" ON dice_rolls
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM room_members rm
      WHERE rm.room_id = dice_rolls.room_id
      AND rm.user_id = auth.uid()
    )
  );

-- ============================================
-- 6. 战斗表
-- ============================================
CREATE TABLE IF NOT EXISTS combats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  current_turn INTEGER DEFAULT 0,
  round INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 战斗表索引
CREATE INDEX IF NOT EXISTS idx_combats_room_id ON combats(room_id);
CREATE INDEX IF NOT EXISTS idx_combats_is_active ON combats(is_active);

-- 战斗表RLS策略
ALTER TABLE combats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Room members can view combats" ON combats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM room_members rm
      WHERE rm.room_id = combats.room_id
      AND rm.user_id = auth.uid()
    )
  );

CREATE POLICY "GM can manage combats" ON combats
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM room_members rm
      WHERE rm.room_id = combats.room_id
      AND rm.user_id = auth.uid()
      AND rm.role = 'gm'
    )
  );

-- ============================================
-- 7. 战斗参与者表
-- ============================================
CREATE TABLE IF NOT EXISTS combatants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  combat_id UUID REFERENCES combats(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  initiative INTEGER NOT NULL,
  hp INTEGER NOT NULL,
  max_hp INTEGER NOT NULL,
  ac INTEGER,
  conditions TEXT[] DEFAULT '{}',
  is_player BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 战斗参与者表索引
CREATE INDEX IF NOT EXISTS idx_combatants_combat_id ON combatants(combat_id);
CREATE INDEX IF NOT EXISTS idx_combatants_initiative ON combatants(initiative DESC);

-- 战斗参与者表RLS策略
ALTER TABLE combatants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Room members can view combatants" ON combatants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM combats c
      JOIN room_members rm ON rm.room_id = c.room_id
      WHERE c.id = combatants.combat_id
      AND rm.user_id = auth.uid()
    )
  );

CREATE POLICY "GM can manage combatants" ON combatants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM combats c
      JOIN room_members rm ON rm.room_id = c.room_id
      WHERE c.id = combatants.combat_id
      AND rm.user_id = auth.uid()
      AND rm.role = 'gm'
    )
  );

-- ============================================
-- 8. 触发器：自动更新updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON characters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_combats_updated_at BEFORE UPDATE ON combats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_combatants_updated_at BEFORE UPDATE ON combatants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 9. 启用Realtime
-- ============================================
-- 为需要实时更新的表启用Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE dice_rolls;
ALTER PUBLICATION supabase_realtime ADD TABLE combats;
ALTER PUBLICATION supabase_realtime ADD TABLE combatants;
ALTER PUBLICATION supabase_realtime ADD TABLE room_members;

-- ============================================
-- 完成！
-- ============================================
-- 数据库初始化完成
-- 现在可以在应用中使用Supabase了

