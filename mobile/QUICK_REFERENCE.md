# Quick Reference - Theme & Components

## 🎨 Core Imports

```typescript
// Colors & Shadows
import { colors, shadows } from "../../theme/colors";

// Typography
import { typography, fontFamilies, textPresets } from "../../theme/typography";

// Spacing & Radius
import { spacing, radius, padding, margin, gap } from "../../theme/spacing";

// Utilities
import { createCardStyle, flexCenterStyle } from "../../theme/utils";

// Or import everything
import { colors, typography, spacing, radius } from "../../theme";
```

---

## 🎯 Colors Quick Reference

### Primary Colors

```
colors.primary         #1B5E20  (Main green)
colors.primaryLight    #2E7D32  (Lighter)
colors.primaryDark     #0D3B12  (Darker)
colors.primarySoft     #E8F5E9  (Soft background)
colors.primaryExtraLight #F1F8F4 (Extra light)
```

### Accent Colors

```
colors.accent          #F9A825  (Gold/Amber)
colors.accentLight     #FDD835  (Lighter)
colors.accentDark      #F57C00  (Darker)
colors.accentSoft      #FFF8E1  (Soft background)
```

### Semantic Colors

```
colors.success         #2E7D32  (Success)
colors.warning         #F57F17  (Warning)
colors.error           #C62828  (Error)
colors.pending         #1565C0  (Pending)
colors.text            #1A1A1A  (Primary text)
colors.textSecondary   #5C6B5E  (Secondary text)
colors.textTertiary    #8E9A8F  (Tertiary text)
```

---

## 📐 Spacing Quick Reference

```
spacing.xs      4px
spacing.sm      8px
spacing.md      12px
spacing.lg      16px
spacing.xl      20px
spacing.2xl     24px
spacing.3xl     32px
spacing.4xl     40px
spacing.5xl     48px
```

---

## ◇ Radius Quick Reference

```
radius.sm       4px
radius.md       8px
radius.lg       12px
radius.xl       14px   (Buttons)
radius.2xl      16px   (Cards)
radius.3xl      20px
radius.4xl      24px   (Large sections)
radius.full     9999px (Pills)
```

---

## 🔤 Typography Quick Reference

### Heading Styles

```typescript
typography.heading1    25px Bold
typography.heading2    22px Bold
typography.heading3    20px SemiBold
typography.heading4    18px SemiBold
typography.heading5    16px SemiBold
```

### Body Styles

```typescript
typography.bodyLarge   16px Regular
typography.body        14px Regular
typography.small       13px Regular
```

### Caption Styles

```typescript
typography.caption     12px Regular
typography.label       11px SemiBold Uppercase
```

### Presets

```typescript
textPresets.greeting          14px Regular (on hero)
textPresets.greetingName      24px Bold
textPresets.cardTitle         16px SemiBold
textPresets.badge             11px SemiBold
textPresets.statNumber        24px Bold
```

---

## 🔘 Button Component

```typescript
import { Button } from '../../components/ui/Button';

// Basic
<Button
  title="Click"
  onPress={() => console.log('clicked')}
/>

// Variants
<Button title="Default" variant="default" />
<Button title="Secondary" variant="secondary" />
<Button title="Accent" variant="accent" />
<Button title="Outline" variant="outline" />
<Button title="Ghost" variant="ghost" />
<Button title="Delete" variant="destructive" />

// Sizes
<Button title="Small" size="small" />
<Button title="Medium" size="medium" />
<Button title="Large" size="large" />

// With Icon
<Button
  title="Camera"
  icon={<Icon />}
  iconPosition="left"
/>

// States
<Button title="Loading..." loading={true} />
<Button title="Disabled" disabled={true} />
```

---

## 🎴 Card Component

```typescript
import { Card } from '../../components/ui/Card';

// Default
<Card>Content</Card>

// Variants
<Card variant="default">Default card</Card>
<Card variant="elevated">Elevated card</Card>
<Card variant="filled">Filled card</Card>
<Card variant="outlined">Outlined card</Card>

// Padding
<Card padding="xs">Tight</Card>
<Card padding="sm">Small</Card>
<Card padding="md">Medium</Card>
<Card padding="lg">Large</Card>

// Pressable
<Card onPress={() => {}}>Tap me</Card>
```

---

## 🏷️ Badge Component

```typescript
import { Badge } from '../../components/ui/Badge';

// Variants
<Badge label="Default" variant="default" />
<Badge label="Success" variant="success" />
<Badge label="Warning" variant="warning" />
<Badge label="Error" variant="error" />
<Badge label="Pending" variant="pending" />

// With Icon
<Badge
  label="Active"
  icon={<Icon />}
  variant="success"
/>
```

---

## 📝 Input Component

```typescript
import { Input } from '../../components/ui/Input';

// Basic
<Input placeholder="Enter text" />

// With Label
<Input label="Email" placeholder="your@email.com" />

// Variants
<Input variant="default" />
<Input variant="outline" />
<Input variant="filled" />

// Sizes
<Input size="small" />
<Input size="medium" />
<Input size="large" />

// With Error
<Input
  placeholder="Username"
  error="Username is required"
/>
```

---

## 💬 Textarea Component

```typescript
import { Textarea } from '../../components/ui/Textarea';

<Textarea
  label="Description"
  placeholder="Enter description"
  minHeight={120}
  error={error}
/>
```

---

## 🎨 Gradient Button

```typescript
import { GradientButton } from '../../components/ui/GradientButton';

// Default (green gradient)
<GradientButton title="Submit" onPress={() => {}} />

// Custom gradient
<GradientButton
  title="Custom"
  gradientColors={['#FF6B6B', '#FFE66D']}
  onPress={() => {}}
/>

// Full width
<GradientButton title="Full Width" full={true} />

// Sizes
<GradientButton title="Small" size="small" />
<GradientButton title="Large" size="large" />
```

---

## 📱 Common Patterns

### Screen Container

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

### Gradient Header

```typescript
import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient
  colors={[colors.primary, colors.primaryLight]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.hero}
>
  <Text style={typography.heading1}>Title</Text>
</LinearGradient>
```

### Card Grid

```typescript
<View style={styles.grid}>
  {items.map((item) => (
    <Card key={item.id} variant="elevated">
      <Text>{item.title}</Text>
    </Card>
  ))}
</View>

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
```

### Section Layout

```typescript
<View style={styles.section}>
  <Text style={typography.heading4}>Title</Text>
  <View style={styles.content}>
    {/* Content */}
  </View>
</View>

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing['3xl'],
  },
  content: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
});
```

---

## 🎯 Shadows Quick Reference

```typescript
// Use with views
<View style={shadows.sm}>Light shadow</View>
<View style={shadows.md}>Medium shadow</View>
<View style={shadows.lg}>Large shadow</View>

// Shadow levels
shadows.xs    - Minimal (1px elevation)
shadows.sm    - Subtle (2px elevation)
shadows.md    - Comfortable (3px elevation)
shadows.lg    - Prominent (4px elevation)
shadows.xl    - Modal (5px elevation)
shadows.soft  - Custom soft shadow
```

---

## ⌨️ Helpful Utilities

```typescript
import {
  flexCenterStyle,
  flexBetweenStyle,
  flexColumnStyle,
  flexColumnCenterStyle,
  screenContainerStyle,
  contentPaddingStyle,
  createCardStyle,
  createChipStyle,
} from '../../theme/utils';

// Usage
<View style={flexCenterStyle}>Centered</View>
<View style={flexBetweenStyle}>Space between</View>
<View style={screenContainerStyle}>Screen</View>
```

---

## 🔗 Haptics Integration

```typescript
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const handlePress = () => {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
  // Do something
};
```

---

## 📚 Documentation

- **THEME_GUIDE.md** - Complete usage guide
- **IMPLEMENTATION_SUMMARY.md** - Implementation details
- **COMPLETION_REPORT.md** - What was changed
- **HomeScreen.tsx** - Live examples

---

## 🆘 Common Issues

### Colors not showing?

```typescript
// ❌ Wrong
import { primary } from '../../theme';

// ✅ Correct
import { colors } from '../../theme';
<View style={{ backgroundColor: colors.primary }} />
```

### Typography not working?

```typescript
// ❌ Missing import
<Text style={{ fontSize: 18, fontWeight: '700' }}>Text</Text>

// ✅ Use typography
import { typography } from '../../theme';
<Text style={typography.heading4}>Text</Text>
```

### Spacing inconsistent?

```typescript
// ❌ Hardcode
<View style={{ padding: 20, marginBottom: 16 }}>

// ✅ Use spacing
import { spacing } from '../../theme';
<View style={{ padding: spacing.lg, marginBottom: spacing.lg }}>
```

---

**Last Updated**: February 17, 2026
**Status**: ✅ Ready to use
