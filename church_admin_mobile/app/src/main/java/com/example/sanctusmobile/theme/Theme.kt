package com.example.sanctusmobile.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val SanctusColorScheme = darkColorScheme(
    primary = SanctusIndigo,
    secondary = DarkSurfaceVariant,
    tertiary = SanctusGold,
    background = DarkBackground,
    surface = DarkSurface,
    onPrimary = Color.White,
    onSecondary = Color.White,
    onTertiary = Color.Black,
    onBackground = Color.White,
    onSurface = Color.White,
    surfaceVariant = DarkSurfaceVariant,
    onSurfaceVariant = Color.White
)

@Composable
fun SanctusMobileTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = SanctusColorScheme,
        typography = Typography,
        content = content
    )
}
