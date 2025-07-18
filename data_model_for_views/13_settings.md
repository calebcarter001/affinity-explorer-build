# Settings Page - Data Model Specification

## 📋 **Overview**

The Settings Page provides user configuration options, preferences management, and system settings for the Affinity Explorer application. It allows users to customize their experience, manage account settings, and configure application behavior.

## 🎯 **Navigation & Location**
- **File**: `/src/pages/Settings.jsx`
- **Route**: `/settings`
- **Navigation**: Accessible from user menu or direct route
- **Icon**: `⚙️` (Settings icon)
- **Permissions**: Requires user authentication

## 🎯 **View Components**

1. **User Profile Section**: Avatar, name, email, role information
2. **Preferences Panel**: Theme, language, default views, notifications
3. **Account Settings**: Password change, email updates, security settings
4. **Application Settings**: Data refresh intervals, cache settings, performance options
5. **Permissions Panel**: Role-based access control display
6. **Export/Import**: Data export options, configuration backup/restore

## 🗃️ **Complete Data Model**

### Primary API Endpoints
```
GET /api/user/settings
PUT /api/user/settings
POST /api/user/settings/reset
```

### Response Schema
```typescript
interface UserSettingsResponse {
  user_profile: UserProfile;
  preferences: UserPreferences;
  account_settings: AccountSettings;
  application_settings: ApplicationSettings;
  permissions: UserPermissions;
  metadata: SettingsMetadata;
}
```

### User Profile Schema
```typescript
interface UserProfile {
  user_id: string;
  display_name: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer';
  avatar_url?: string;
  created_at: string;                     // ISO 8601
  last_login: string;                     // ISO 8601
  login_count: number;
  profile_completion: number;             // 0.0 - 1.0 percentage
}
```

### User Preferences Schema
```typescript
interface UserPreferences {
  // UI Preferences
  theme: 'light' | 'dark' | 'auto';
  language: string;                       // ISO 639-1 language code
  timezone: string;                       // IANA timezone identifier
  date_format: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  time_format: '12h' | '24h';
  
  // Application Preferences
  default_destination: string;            // Default destination for insights
  default_view: 'dashboard' | 'affinities' | 'destination-insights' | 'agents';
  items_per_page: 10 | 25 | 50 | 100;
  auto_refresh: boolean;
  refresh_interval: number;               // Minutes
  
  // Notification Preferences
  email_notifications: boolean;
  push_notifications: boolean;
  notification_types: {
    system_updates: boolean;
    data_refresh: boolean;
    analysis_complete: boolean;
    error_alerts: boolean;
  };
  
  // Data Display Preferences
  show_confidence_scores: boolean;
  show_evidence_sources: boolean;
  compact_view: boolean;
  advanced_features: boolean;
}
```

### Account Settings Schema
```typescript
interface AccountSettings {
  // Security Settings
  two_factor_enabled: boolean;
  password_last_changed: string;          // ISO 8601
  session_timeout: number;                // Minutes
  login_notifications: boolean;
  
  // Privacy Settings
  data_sharing_consent: boolean;
  analytics_tracking: boolean;
  usage_statistics: boolean;
  
  // Account Status
  account_status: 'active' | 'suspended' | 'pending';
  subscription_tier: 'basic' | 'premium' | 'enterprise';
  subscription_expires: string;           // ISO 8601
}
```

### Application Settings Schema
```typescript
interface ApplicationSettings {
  // Performance Settings
  cache_enabled: boolean;
  cache_duration: number;                 // Hours
  preload_data: boolean;
  lazy_loading: boolean;
  
  // Data Settings
  data_retention_days: number;
  auto_backup: boolean;
  backup_frequency: 'daily' | 'weekly' | 'monthly';
  
  // API Settings
  api_timeout: number;                    // Seconds
  retry_attempts: number;
  batch_size: number;
  
  // Debug Settings
  debug_mode: boolean;
  verbose_logging: boolean;
  performance_monitoring: boolean;
}
```

### User Permissions Schema
```typescript
interface UserPermissions {
  role: 'admin' | 'analyst' | 'viewer';
  permissions: string[];                  // Array of permission strings
  restricted_features: string[];          // Features user cannot access
  data_access_level: 'full' | 'limited' | 'read_only';
  
  // Feature-specific permissions
  can_edit_affinities: boolean;
  can_run_agents: boolean;
  can_export_data: boolean;
  can_manage_users: boolean;
  can_access_analytics: boolean;
}
```

### Settings Metadata Schema
```typescript
interface SettingsMetadata {
  last_updated: string;                   // ISO 8601
  settings_version: string;
  default_settings_applied: boolean;
  migration_status: 'complete' | 'pending' | 'failed';
  backup_available: boolean;
  last_backup: string;                    // ISO 8601
}
```

## 🔄 **Data Flow**

1. **Page Load**: Fetch current user settings and preferences
2. **Setting Changes**: Update individual settings with immediate feedback
3. **Validation**: Client-side validation before API calls
4. **Persistence**: Save changes to backend with optimistic updates
5. **Reset Options**: Restore default settings or previous backup

## 🎨 **UI Data Binding**

### Theme Toggle
```typescript
const handleThemeChange = (newTheme) => {
  setPreferences(prev => ({ ...prev, theme: newTheme }));
  updateUserSettings({ preferences: { theme: newTheme } });
};
```

### Notification Settings
```typescript
const handleNotificationToggle = (type, enabled) => {
  setPreferences(prev => ({
    ...prev,
    notification_types: {
      ...prev.notification_types,
      [type]: enabled
    }
  }));
};
```

### Form Validation
```typescript
const validateSettings = (settings) => {
  const errors = {};
  
  if (settings.refresh_interval < 1 || settings.refresh_interval > 60) {
    errors.refresh_interval = 'Refresh interval must be between 1 and 60 minutes';
  }
  
  if (settings.items_per_page && ![10, 25, 50, 100].includes(settings.items_per_page)) {
    errors.items_per_page = 'Invalid items per page value';
  }
  
  return errors;
};
```

## 🔍 **Mock Data Structure**

```typescript
const mockUserSettings = {
  user_profile: {
    user_id: 'user_123',
    display_name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'analyst',
    created_at: '2024-01-15T10:00:00Z',
    last_login: '2024-03-20T14:30:00Z',
    login_count: 45,
    profile_completion: 0.85
  },
  preferences: {
    theme: 'light',
    language: 'en',
    timezone: 'America/New_York',
    default_destination: 'paris',
    default_view: 'dashboard',
    items_per_page: 25,
    auto_refresh: true,
    refresh_interval: 15,
    email_notifications: true,
    show_confidence_scores: true,
    compact_view: false
  },
  account_settings: {
    two_factor_enabled: false,
    password_last_changed: '2024-02-01T09:00:00Z',
    session_timeout: 480,
    account_status: 'active',
    subscription_tier: 'premium'
  },
  permissions: {
    role: 'analyst',
    permissions: ['read', 'write', 'export'],
    can_edit_affinities: true,
    can_run_agents: true,
    can_export_data: true,
    can_manage_users: false
  }
};
```

## 🚀 **Implementation Notes**

1. **Responsive Design**: Settings panels adapt to different screen sizes
2. **Real-time Updates**: Changes are saved immediately with visual feedback
3. **Validation**: Client-side validation with server-side confirmation
4. **Accessibility**: Proper ARIA labels and keyboard navigation
5. **Security**: Sensitive settings require re-authentication
6. **Backup/Restore**: Configuration backup and restore functionality

## 🔗 **Related Components**

- `UserProfile.jsx` - User profile management component
- `ThemeToggle.jsx` - Theme switching component
- `NotificationSettings.jsx` - Notification preferences component
- `PermissionsDisplay.jsx` - Role and permissions display
