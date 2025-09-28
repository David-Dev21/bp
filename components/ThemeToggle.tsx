import { Pressable, View } from 'react-native';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { MoonStar, Sun } from 'lucide-react-native';
import { Icon } from '~/components/ui/icon';
import { useColorScheme } from 'nativewind';

export function ThemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDarkColorScheme = colorScheme === 'dark';

  function toggleColorScheme() {
    const newTheme = isDarkColorScheme ? 'light' : 'dark';
    setColorScheme(newTheme);
    setAndroidNavigationBar(newTheme);
  }

  return (
    <Pressable
      onPress={toggleColorScheme}
      className='web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 active:opacity-70'
    >
      <View className='flex-1 aspect-square pt-0.5 justify-center items-start web:px-5'>
        {isDarkColorScheme ? (
          <Icon as={MoonStar} className='text-foreground' size={23} />
        ) : (
          <Icon as={Sun} className='text-foreground' size={24} />
        )}
      </View>
    </Pressable>
  );
}
