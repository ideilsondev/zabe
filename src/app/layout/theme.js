import { useLayout } from '@/app/layout';
import { primaryColors, surfaceColors } from '@/app/layout/colors';
import { $t, updatePreset, updateSurfacePalette } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import Material from '@primeuix/themes/material';
import Nora from '@primeuix/themes/nora';

const { layoutConfig } = useLayout();


function onChangeTheme(theme) {

  const presets = {
    Aura,
    Lara,
    Nora,
    Material
  };

  const primary = primaryColors.find((element) => element.name === theme.primary);
  const surface = surfaceColors.find((element) => element.name === theme.surface);

  layoutConfig.primary = primary.name;
  updatePreset(getPresetExt());

  layoutConfig.surface = surface.name;
  updateSurfacePalette(surface.palette);

  layoutConfig.preset = theme.preset;;
  layoutConfig.menuMode = theme.menuMode;

  const preset = presets[theme.preset];
  const surfacePalette = surfaceColors.find((element) => element.name === theme.surface)?.palette;

  $t().preset(preset).preset(getPresetExt()).surfacePalette(surfacePalette).use({ useDefaultOptions: true });
  toggleDarkMode(theme);
}

function toggleDarkMode(theme) {
  if (!document.startViewTransition) {
    executetoggleDarkMode(theme)
    return;
  }
  document.startViewTransition(() => executetoggleDarkMode(theme))
}

function executetoggleDarkMode(theme) {
  const { darkTheme } = theme
  if (darkTheme === false) {
    layoutConfig.darkTheme = false;
    document.documentElement.classList.remove('app-dark');
  } else {
    layoutConfig.darkTheme === true;
    document.documentElement.classList.add('app-dark');
  }
}

function getPresetExt() {
  const color = primaryColors.find((element) => element.name === layoutConfig.primary);
  if (color.name === 'noir') {
    return {
      semantic: {
        primary: {
          50: '{surface.50}',
          100: '{surface.100}',
          200: '{surface.200}',
          300: '{surface.300}',
          400: '{surface.400}',
          500: '{surface.500}',
          600: '{surface.600}',
          700: '{surface.700}',
          800: '{surface.800}',
          900: '{surface.900}',
          950: '{surface.950}'
        },
        colorScheme: {
          light: {
            primary: {
              color: '{primary.950}',
              contrastColor: '#ffffff',
              hoverColor: '{primary.800}',
              activeColor: '{primary.700}'
            },
            highlight: {
              background: '{primary.950}',
              focusBackground: '{primary.700}',
              color: '#ffffff',
              focusColor: '#ffffff'
            }
          },
          dark: {
            primary: {
              color: '{primary.50}',
              contrastColor: '{primary.950}',
              hoverColor: '{primary.200}',
              activeColor: '{primary.300}'
            },
            highlight: {
              background: '{primary.50}',
              focusBackground: '{primary.300}',
              color: '{primary.950}',
              focusColor: '{primary.950}'
            }
          }
        }
      }
    };
  } else {
    return {
      semantic: {
        primary: color.palette,
        colorScheme: {
          light: {
            primary: {
              color: '{primary.500}',
              contrastColor: '#ffffff',
              hoverColor: '{primary.600}',
              activeColor: '{primary.700}'
            },
            highlight: {
              background: '{primary.50}',
              focusBackground: '{primary.100}',
              color: '{primary.700}',
              focusColor: '{primary.800}'
            }
          },
          dark: {
            primary: {
              color: '{primary.400}',
              contrastColor: '{surface.900}',
              hoverColor: '{primary.300}',
              activeColor: '{primary.200}'
            },
            highlight: {
              background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
              focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
              color: 'rgba(255,255,255,.87)',
              focusColor: 'rgba(255,255,255,.87)'
            }
          }
        }
      }
    };
  }
}

export { onChangeTheme };
