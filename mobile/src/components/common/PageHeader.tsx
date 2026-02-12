import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { Button } from '../ui/Button';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  action?: React.ReactNode;
};

export function PageHeader({ title, subtitle, showBack, action }: PageHeaderProps) {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBack && (
          <Button
            title="Back"
            variant="ghost"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        )}
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {action ? <View>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
  },
});
