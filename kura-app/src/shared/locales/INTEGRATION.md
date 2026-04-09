# 在现有组件中集成翻译 - 实践指南

## 示例 1：在设置面板中使用翻译

### 之前（硬编码文本）
```typescript
<SectionHeader title="Preferences" />
<PreferenceToggle
  label="Large Transactions"
  description="Alert on spends over $500"
  value={preferences.largeTransactionAlerts}
  onValueChange={toggleLargeTransactionAlerts}
/>
```

### 之后（使用翻译）
```typescript
import { useAppTranslation } from '../../../shared/hooks/useAppTranslation';

export default function UserSettingsModal() {
  const { t } = useAppTranslation();
  
  return (
    <>
      <SectionHeader title={t('settings.preferences')} />
      <PreferenceToggle
        label={t('settings.largeTransactions')}
        description={t('settings.largeTransactionsDescription')}
        value={preferences.largeTransactionAlerts}
        onValueChange={toggleLargeTransactionAlerts}
      />
    </>
  );
}
```

## 示例 2：在登录屏幕中使用翻译

### 之前
```typescript
<Text>Email</Text>
<TextInput placeholder="Enter your email" />
<TouchableOpacity>
  <Text>Login</Text>
</TouchableOpacity>
<TouchableOpacity>
  <Text>Forgot Password?</Text>
</TouchableOpacity>
```

### 之后
```typescript
import { useAppTranslation } from '../../../shared/hooks/useAppTranslation';

export default function LoginScreen() {
  const { t } = useAppTranslation();
  
  return (
    <>
      <Text>{t('auth.email')}</Text>
      <TextInput placeholder={t('auth.email')} />
      <TouchableOpacity>
        <Text>{t('auth.login')}</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text>{t('auth.forgotPassword')}</Text>
      </TouchableOpacity>
    </>
  );
}
```

## 示例 3：在仪表板中使用翻译

### 之前
```typescript
<Text>Net Worth</Text>
<View>
  <Text>Total Assets</Text>
  <Text>Total Liabilities</Text>
</View>
<TouchableOpacity>
  <Text>Accounts</Text>
</TouchableOpacity>
<TouchableOpacity>
  <Text>Investments</Text>
</TouchableOpacity>
```

### 之后
```typescript
import { useAppTranslation } from '../../../shared/hooks/useAppTranslation';

export default function DashboardScreen() {
  const { t } = useAppTranslation();
  
  return (
    <>
      <Text>{t('dashboard.netWorth')}</Text>
      <View>
        <Text>{t('dashboard.totalAssets')}</Text>
        <Text>{t('dashboard.totalLiabilities')}</Text>
      </View>
      <TouchableOpacity>
        <Text>{t('accounts.title')}</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text>{t('investments.title')}</Text>
      </TouchableOpacity>
    </>
  );
}
```

## 示例 4：带有参数的翻译

如果需要动态内容，可以使用 i18next 的插值功能：

### 翻译文件
```json
{
  "dashboard": {
    "balance": "Your balance: {{amount}}"
  }
}
```

### 组件中使用
```typescript
const { t } = useAppTranslation();

<Text>{t('dashboard.balance', { amount: '$1,234.56' })}</Text>
```

## 步骤：迁移现有组件

### 1. 导入 hook
```typescript
import { useAppTranslation } from '../../../shared/hooks/useAppTranslation';
```

### 2. 在组件中使用
```typescript
export default function MyComponent() {
  const { t } = useAppTranslation();
  // ...
}
```

### 3. 替换硬编码文本
找到所有硬编码的文本，用 `t('key')` 替换

### 4. 在翻译文件中添加对应的 key
在 `src/shared/locales/en/common.json` 和 `src/shared/locales/zh/common.json` 中添加

### 5. 测试
清除缓存并重新加载应用，尝试切换语言

## 常见问题

### Q: 翻译不生效
A: 检查以下几点：
- ✓ Hook 是否正确导入
- ✓ key 是否与翻译文件中的 key 一致
- ✓ 翻译文件是否同时更新了英文和中文
- ✓ App.tsx 中是否用 I18nextProvider 包裹了应用

### Q: 如何处理复数形式或条件翻译
A: i18next 支持高级功能，参见 [i18next documentation](https://www.i18next.com/translation-function/plurals)

### Q: 能否按需加载翻译文件
A: 当前实现将所有翻译加载到内存中。对于大型应用，可以考虑使用 `i18next-http-backend` 来按需加载。

## 下一步

- [ ] 迁移所有硬编码的用户面向文本
- [ ] 为所有错误消息添加翻译
- [ ] 添加更多语言支持
- [ ] 考虑从翻译管理服务（如 Crowdin）集成
