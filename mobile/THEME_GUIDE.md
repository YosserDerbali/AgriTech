# Mobile UI/UX Enhancement Documentation

## Overview

The mobile application has been enhanced with a comprehensive design system inspired by the Smart-Farm-Data UI patterns. This includes:

- **Enhanced Color Palette** - Professional, semantic color system
- **Typography System** - Custom font family (Inter) with consistent sizing scales
- **Spacing System** - 8-point grid-based spacing for consistency
- **Shadow/Elevation System** - Multiple shadow levels for depth
- **Component Library** - Enhanced UI components with variants
- **Haptics Feedback** - Tactile feedback for interactions
- **Gradients** - LinearGradient support for visual hierarchy

## Theme System Architecture

### File Structure

```
src/theme/
├── colors.ts          # Color palette with semantic naming
├── typography.ts      # Font families and text styles
├── spacing.ts         # Spacing, radius, and gap presets
├── utils.ts           # UI utilities and helper functions
└── index.ts           # Central export
```

## How to Use

### Colors

```typescript
import { colors } from '../../theme/colors';

// Use semantic colors
<View style={{ backgroundColor: colors.primary }}>
  <Text style={{ color: colors.text }}>Hello</Text>
</View>

// Or with shadows
<View style={{ ...colors.shadows.md }}>
  Content
</View>
```

### Typography

```typescript
import { typography, fontFamilies, textPresets } from '../../theme/typography';

// Use predefined text styles
<Text style={typography.heading1}>Main Heading</Text>
<Text style={typography.body}>Body text</Text>
<Text style={typography.caption}>Small text</Text>

// Use font families for custom styles
<Text style={{
  fontFamily: fontFamilies.bold,
  fontSize: 18
}}>Custom text</Text>
```

### Spacing & Radius

```typescript
import { spacing, radius, padding, margin. gap } from '../../theme/spacing';

// Use consistent spacing
<View style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}>
  <View style={{ gap: spacing.md, marginBottom: spacing.xl }}>
    Item 1
    Item 2
  </View>
</View>

// Use consistent radius
<View style={{ borderRadius: radius['2xl'] }}>
  Rounded content
</View>
```

### Components

#### Button

```typescript
import { Button } from '../../components/ui/Button';

// Default button
<Button title="Click me" onPress={() => {}} />

// With variants
<Button title="Secondary" variant="secondary" />
<Button title="Outline" variant="outline" />
<Button title="Ghost" variant="ghost" />

// With size
<Button title="Large" size="large" />
<Button title="Small" size="small" />

// With icon
<Button
  title="Camera"
  icon={<Feather name="camera" size={20} />}
  iconPosition="left"
/>

// Haptics can be disabled
<Button title="No haptics" haptics={false} />
```

**Button Props:**

- `variant`: 'default' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'destructive'
- `size`: 'small' | 'medium' | 'large'
- `disabled`: boolean
- `loading`: boolean
- `haptics`: boolean (default: true)

#### Card

```typescript
import { Card } from '../../components/ui/Card';

// Default card
<Card>
  Content
</Card>

// With variant
<Card variant="elevated">Elevated</Card>
<Card variant="filled">Filled</Card>
<Card variant="outlined">Outlined</Card>

// With padding
<Card padding="lg">
  Content with large padding
</Card>
```

**Card Props:**

- `variant`: 'default' | 'elevated' | 'outlined' | 'filled'
- `padding`: 'xs' | 'sm' | 'md' | 'lg'

#### Badge

```typescript
import { Badge } from '../../components/ui/Badge';

<Badge label="Success" variant="success" />
<Badge label="Warning" variant="warning" />
<Badge label="Error" variant="error" />
<Badge label="Pending" variant="pending" />
```

**Badge Variants:**

- 'default' - Green soft background
- 'secondary' - Blue soft background
- 'outline' - Border only
- 'success' - Green
- 'warning' - Amber
- 'error' - Red
- 'pending' - Blue

#### Input

```typescript
import { Input } from '../../components/ui/Input';

<Input
  label="Email"
  placeholder="Enter email"
  variant="default"
  size="medium"
/>

// With error
<Input
  placeholder="Username"
  error="Username is required"
/>
```

**Input Props:**

- `variant`: 'default' | 'outline' | 'filled'
- `size`: 'small' | 'medium' | 'large'
- `label`: string
- `error`: string

#### Textarea

```typescript
import { Textarea } from '../../components/ui/Textarea';

<Textarea
  label="Description"
  minHeight={120}
  placeholder="Enter description"
/>
```

### Gradients

```typescript
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';

<LinearGradient
  colors={[colors.primary, colors.primaryLight]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={{ padding: 20 }}
>
  Gradient content
</LinearGradient>
```

### Haptics Feedback

```typescript
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

// In button press handler
const handlePress = () => {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
  // Do something
};
```

### Safe Area

```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();

<View style={{ paddingTop: insets.top }}>
  Content
</View>
```

## Color Palette Reference

### Primary Colors (Green)

- `primary` - #1B5E20 (Main brand color)
- `primaryLight` - #2E7D32 (Lighter variant)
- `primaryDark` - #0D3B12 (Darker variant)
- `primarySoft` - #E8F5E9 (Soft background)
- `primaryExtraLight` - #F1F8F4 (Extra light background)

### Accent Colors (Gold/Amber)

- `accent` - #F9A825 (Main accent)
- `accentLight` - #FDD835 (Lighter)
- `accentDark` - #F57C00 (Darker)
- `accentSoft` - #FFF8E1 (Soft background)

### Semantic Colors

- `success` - #2E7D32 (Success state)
- `warning` - #F57F17 (Warning state)
- `error` - #C62828 (Error state)
- `pending` - #1565C0 (Pending state)

### Text Colors

- `text` - #1A1A1A (Primary text)
- `textSecondary` - #5C6B5E (Secondary text)
- `textTertiary` - #8E9A8F (Tertiary text)
- `textMuted` - #A8B8AA (Muted text)

## Common Patterns

### 1. Screen Container

```typescript
<SafeAreaView style={styles.safeContainer}>
  <ScrollView style={styles.container}>
    {/* Content */}
  </ScrollView>
</SafeAreaView>

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
});
```

### 2. Hero Section

```typescript
<LinearGradient
  colors={[colors.primary, colors.primaryLight]}
  style={styles.hero}
>
  <Text style={typography.heading1}>Title</Text>
  <Text style={typography.body}>Subtitle</Text>
</LinearGradient>
```

### 3. Card List

```typescript
{items.map((item) => (
  <Pressable
    key={item.id}
    onPress={() => handlePress(item)}
    style={({ pressed }) => [
      styles.card,
      pressed && styles.cardPressed,
    ]}
  >
    <Text style={typography.bodySemibold}>{item.title}</Text>
  </Pressable>
))}

const styles = StyleSheet.create({
  card: {
    ...createCardStyle('elevated'),
    marginBottom: spacing.md,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
});
```

### 4. Action Buttons Grid

```typescript
<View style={styles.grid}>
  <Pressable onPress={() => {}}>
    <View style={[styles.icon, { backgroundColor: colors.successLight }]}>
      <Icon />
    </View>
    <Text style={typography.small}>Action</Text>
  </Pressable>
</View>

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

## Best Practices

1. **Always use theme values** - Never hardcode colors, spacing, or sizes
2. **Use typography scales** - Don't make up font sizes manually
3. **Maintain consistent spacing** - Use the spacing scale (xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl)
4. **Layer shadows properly** - Use shadow system for visual hierarchy
5. **Provide haptics feedback** - Add haptics to important interactions
6. **Test responsiveness** - Ensure components work on different screen sizes
7. **Use semantic color names** - Use `error`, `success`, `warning` instead of specific colors

## Migration Guide

### Old Pattern

```typescript
// Before
<View style={{ backgroundColor: '#1B5E20', padding: 20 }}>
  <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFFFFF' }}>
    Hello
  </Text>
</View>
```

### New Pattern

```typescript
// After
import { colors, shadows } from '../../theme/colors';
import { typography, spacing } from '../../theme';

<View style={{ backgroundColor: colors.primary, padding: spacing.lg, ...shadows.md }}>
  <Text style={[typography.heading4, { color: colors.textInverse }]}>
    Hello
  </Text>
</View>
```

## Troubleshooting

### Fonts not loading

- Ensure `expo-font` and `@expo-google-fonts/inter` are installed
- Run `npm install` or `bun install`

### Colors not updating

- Make sure you're importing from `'../../theme/colors'`
- Verify the import path matches your file location

### Haptics not working on web

- Haptics are automatically disabled on web platform
- Check: `if (Platform.OS !== 'web')`

### Shadows not visible on Android

- Android uses `elevation` property instead of shadows
- Our shadow system includes both `shadowOpacity` and `elevation`

## Contributing

When adding new components or screens:

1. Import theme values from `../../theme`
2. Use semantic color names
3. Follow the spacing grid
4. Add proper TypeScript types
5. Test on both iOS and Android
6. Update this documentation

---

For questions or issues, refer to the Smart-Farm-Data folder for UI pattern reference.
