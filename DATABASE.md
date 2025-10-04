# 数据库设计文档

本文档描述了TRPG助手的数据库结构设计，用于Supabase后端集成。

## 数据库表结构

### 1. users (用户表)

存储用户基本信息。

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用行级安全
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 用户只能查看和更新自己的信息
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### 2. characters (角色卡表)

存储所有游戏系统的角色卡。

```sql
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  game_system TEXT NOT NULL CHECK (game_system IN ('COC', 'DND', 'GENERIC')),
  data JSONB NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_characters_game_system ON characters(game_system);

-- 启用行级安全
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- 用户可以查看自己的角色和公开的角色
CREATE POLICY "Users can view own characters" ON characters
  FOR SELECT USING (auth.uid() = user_id OR is_public = TRUE);

-- 用户只能创建、更新、删除自己的角色
CREATE POLICY "Users can insert own characters" ON characters
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own characters" ON characters
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own characters" ON characters
  FOR DELETE USING (auth.uid() = user_id);
```

### 3. rooms (房间表)

存储游戏房间信息。

```sql
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  game_system TEXT NOT NULL CHECK (game_system IN ('COC', 'DND', 'GENERIC')),
  gm_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_rooms_gm_id ON rooms(gm_id);
CREATE INDEX idx_rooms_is_active ON rooms(is_active);

-- 启用行级安全
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- 所有人都可以查看活跃的房间
CREATE POLICY "Anyone can view active rooms" ON rooms
  FOR SELECT USING (is_active = TRUE);

-- 只有GM可以创建、更新、删除房间
CREATE POLICY "GM can insert rooms" ON rooms
  FOR INSERT WITH CHECK (auth.uid() = gm_id);

CREATE POLICY "GM can update own rooms" ON rooms
  FOR UPDATE USING (auth.uid() = gm_id);

CREATE POLICY "GM can delete own rooms" ON rooms
  FOR DELETE USING (auth.uid() = gm_id);
```

### 4. room_members (房间成员表)

存储房间成员关系。

```sql
CREATE TABLE room_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'player' CHECK (role IN ('gm', 'player')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- 索引
CREATE INDEX idx_room_members_room_id ON room_members(room_id);
CREATE INDEX idx_room_members_user_id ON room_members(user_id);

-- 启用行级安全
ALTER TABLE room_members ENABLE ROW LEVEL SECURITY;

-- 房间成员可以查看同房间的其他成员
CREATE POLICY "Room members can view members" ON room_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM room_members rm
      WHERE rm.room_id = room_members.room_id
      AND rm.user_id = auth.uid()
    )
  );

-- 用户可以加入房间
CREATE POLICY "Users can join rooms" ON room_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 用户可以离开房间
CREATE POLICY "Users can leave rooms" ON room_members
  FOR DELETE USING (auth.uid() = user_id);
```

### 5. dice_rolls (骰子记录表)

存储骰子投掷历史。

```sql
CREATE TABLE dice_rolls (
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

-- 索引
CREATE INDEX idx_dice_rolls_room_id ON dice_rolls(room_id);
CREATE INDEX idx_dice_rolls_user_id ON dice_rolls(user_id);
CREATE INDEX idx_dice_rolls_created_at ON dice_rolls(created_at DESC);

-- 启用行级安全
ALTER TABLE dice_rolls ENABLE ROW LEVEL SECURITY;

-- 房间成员可以查看房间内的骰子记录
CREATE POLICY "Room members can view dice rolls" ON dice_rolls
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM room_members rm
      WHERE rm.room_id = dice_rolls.room_id
      AND rm.user_id = auth.uid()
    )
  );

-- 房间成员可以创建骰子记录
CREATE POLICY "Room members can insert dice rolls" ON dice_rolls
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM room_members rm
      WHERE rm.room_id = dice_rolls.room_id
      AND rm.user_id = auth.uid()
    )
  );
```

### 6. combats (战斗表)

存储战斗状态。

```sql
CREATE TABLE combats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  current_turn INTEGER DEFAULT 0,
  round INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_combats_room_id ON combats(room_id);
CREATE INDEX idx_combats_is_active ON combats(is_active);

-- 启用行级安全
ALTER TABLE combats ENABLE ROW LEVEL SECURITY;

-- 房间成员可以查看战斗
CREATE POLICY "Room members can view combats" ON combats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM room_members rm
      WHERE rm.room_id = combats.room_id
      AND rm.user_id = auth.uid()
    )
  );

-- GM可以创建、更新、删除战斗
CREATE POLICY "GM can manage combats" ON combats
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM room_members rm
      WHERE rm.room_id = combats.room_id
      AND rm.user_id = auth.uid()
      AND rm.role = 'gm'
    )
  );
```

### 7. combatants (战斗参与者表)

存储战斗中的参与者。

```sql
CREATE TABLE combatants (
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

-- 索引
CREATE INDEX idx_combatants_combat_id ON combatants(combat_id);
CREATE INDEX idx_combatants_initiative ON combatants(initiative DESC);

-- 启用行级安全
ALTER TABLE combatants ENABLE ROW LEVEL SECURITY;

-- 房间成员可以查看战斗参与者
CREATE POLICY "Room members can view combatants" ON combatants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM combats c
      JOIN room_members rm ON rm.room_id = c.room_id
      WHERE c.id = combatants.combat_id
      AND rm.user_id = auth.uid()
    )
  );

-- GM可以管理战斗参与者
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
```

## 实时订阅

使用Supabase Realtime功能实现实时同步：

```typescript
// 订阅房间内的骰子投掷
const diceSubscription = supabase
  .channel('dice_rolls')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'dice_rolls',
      filter: `room_id=eq.${roomId}`,
    },
    (payload) => {
      console.log('New dice roll:', payload.new)
    }
  )
  .subscribe()

// 订阅战斗状态变化
const combatSubscription = supabase
  .channel('combat')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'combats',
      filter: `room_id=eq.${roomId}`,
    },
    (payload) => {
      console.log('Combat updated:', payload)
    }
  )
  .subscribe()
```

## 数据迁移

从localStorage迁移到Supabase：

```typescript
// 迁移角色卡
const migrateCharacters = async () => {
  const localCharacters = JSON.parse(localStorage.getItem('trpg_characters') || '[]')
  
  for (const char of localCharacters) {
    await supabase.from('characters').insert({
      name: char.name,
      game_system: char.gameSystem,
      data: char,
    })
  }
}

// 迁移房间
const migrateRooms = async () => {
  const localRooms = JSON.parse(localStorage.getItem('trpg_rooms') || '[]')
  
  for (const room of localRooms) {
    const { data: newRoom } = await supabase.from('rooms').insert({
      name: room.name,
      game_system: room.gameSystem,
    }).select().single()
    
    // 添加房间成员
    for (const playerId of room.players) {
      await supabase.from('room_members').insert({
        room_id: newRoom.id,
        user_id: playerId,
        role: playerId === room.gmId ? 'gm' : 'player',
      })
    }
  }
}
```

## 性能优化

1. **索引优化**: 为常用查询字段添加索引
2. **分页查询**: 使用limit和offset进行分页
3. **缓存策略**: 使用React Query或SWR缓存数据
4. **批量操作**: 使用批量插入减少请求次数

## 安全考虑

1. **行级安全(RLS)**: 确保用户只能访问授权的数据
2. **输入验证**: 在客户端和服务端都进行数据验证
3. **SQL注入防护**: 使用参数化查询
4. **敏感数据加密**: 对敏感信息进行加密存储

## 备份策略

1. **自动备份**: 配置Supabase自动备份
2. **导出功能**: 提供数据导出功能
3. **版本控制**: 保留数据变更历史

