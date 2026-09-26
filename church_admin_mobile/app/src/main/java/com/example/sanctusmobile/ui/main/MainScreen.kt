package com.example.sanctusmobile.ui.main

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.sanctusmobile.data.Believer
import com.example.sanctusmobile.data.DefaultDataRepository
import com.example.sanctusmobile.data.Task
import com.example.sanctusmobile.theme.*
import com.example.sanctusmobile.ui.directory.DirectoryScreen
import com.example.sanctusmobile.ui.pastors.PastorsScreen
import com.example.sanctusmobile.ui.study.BibleStudyScreen
import com.example.sanctusmobile.ui.attendance.AttendanceScreen

@Composable
fun MainScreen(
    modifier: Modifier = Modifier,
    viewModel: MainScreenViewModel = viewModel { MainScreenViewModel(DefaultDataRepository()) }
) {
    val currentTab by viewModel.currentTab.collectAsState()

    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface,
                tonalElevation = 8.dp
            ) {
                NavigationBarItem(
                    selected = currentTab == SanctusTab.Dashboard,
                    onClick = { viewModel.selectTab(SanctusTab.Dashboard) },
                    icon = { Icon(Icons.Default.Home, contentDescription = "Dashboard") },
                    label = { Text("Dashboard", fontSize = 10.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = SanctusIndigo,
                        selectedTextColor = SanctusIndigo,
                        indicatorColor = SanctusIndigo.copy(alpha = 0.1f),
                        unselectedIconColor = MutedText,
                        unselectedTextColor = MutedText
                    )
                )
                NavigationBarItem(
                    selected = currentTab == SanctusTab.Directory,
                    onClick = { viewModel.selectTab(SanctusTab.Directory) },
                    icon = { Icon(Icons.Default.List, contentDescription = "Directory") },
                    label = { Text("Directory", fontSize = 10.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = SanctusIndigo,
                        selectedTextColor = SanctusIndigo,
                        indicatorColor = SanctusIndigo.copy(alpha = 0.1f),
                        unselectedIconColor = MutedText,
                        unselectedTextColor = MutedText
                    )
                )
                NavigationBarItem(
                    selected = currentTab == SanctusTab.Pastors,
                    onClick = { viewModel.selectTab(SanctusTab.Pastors) },
                    icon = { Icon(Icons.Default.Person, contentDescription = "Pastors") },
                    label = { Text("Pastors", fontSize = 10.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = SanctusIndigo,
                        selectedTextColor = SanctusIndigo,
                        indicatorColor = SanctusIndigo.copy(alpha = 0.1f),
                        unselectedIconColor = MutedText,
                        unselectedTextColor = MutedText
                    )
                )
                NavigationBarItem(
                    selected = currentTab == SanctusTab.BibleStudy,
                    onClick = { viewModel.selectTab(SanctusTab.BibleStudy) },
                    icon = { Icon(Icons.Default.Book, contentDescription = "Studies") },
                    label = { Text("Study", fontSize = 10.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = SanctusIndigo,
                        selectedTextColor = SanctusIndigo,
                        indicatorColor = SanctusIndigo.copy(alpha = 0.1f),
                        unselectedIconColor = MutedText,
                        unselectedTextColor = MutedText
                    )
                )
                NavigationBarItem(
                    selected = currentTab == SanctusTab.Attendance,
                    onClick = { viewModel.selectTab(SanctusTab.Attendance) },
                    icon = { Icon(Icons.Default.DateRange, contentDescription = "Attendance") },
                    label = { Text("Attendance", fontSize = 10.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = SanctusIndigo,
                        selectedTextColor = SanctusIndigo,
                        indicatorColor = SanctusIndigo.copy(alpha = 0.1f),
                        unselectedIconColor = MutedText,
                        unselectedTextColor = MutedText
                    )
                )
            }
        },
        modifier = modifier
    ) { innerPadding ->
        val tabModifier = Modifier.padding(innerPadding)
        when (currentTab) {
            SanctusTab.Dashboard -> DashboardView(viewModel = viewModel, modifier = tabModifier)
            SanctusTab.Directory -> DirectoryScreen(viewModel = viewModel, modifier = tabModifier)
            SanctusTab.Pastors -> PastorsScreen(viewModel = viewModel, modifier = tabModifier)
            SanctusTab.BibleStudy -> BibleStudyScreen(viewModel = viewModel, modifier = tabModifier)
            SanctusTab.Attendance -> AttendanceScreen(viewModel = viewModel, modifier = tabModifier)
        }
    }
}

@Composable
fun DashboardView(
    viewModel: MainScreenViewModel,
    modifier: Modifier = Modifier
) {
    val believers by viewModel.believers.collectAsState()
    val families by viewModel.families.collectAsState()
    val tasks by viewModel.tasks.collectAsState()
    val attendance by viewModel.attendance.collectAsState()

    // Calculations
    val totalBelievers = believers.size
    val totalFamilies = families.size
    
    // Attendance rate for '2026-06-07'
    val lastSundayAttendance = attendance["2026-06-07"] ?: emptyMap()
    val presentCount = lastSundayAttendance.values.count { it }
    val attendanceRate = if (totalBelievers > 0) Math.round((presentCount.toDouble() / totalBelievers) * 100).toInt() else 0

    // Study completion rate
    val studyCompletedCount = believers.count { it.studyCompleted }
    val studyRate = if (totalBelievers > 0) Math.round((studyCompletedCount.toDouble() / totalBelievers) * 100).toInt() else 0

    // Lists
    val activeTasks = tasks.filter { it.status != "completed" }.take(3)
    val sortedNewcomers = believers.sortedByDescending { it.dateJoined }.take(4)
    val prayerRequests = believers.filter { it.prayerRequests.isNotEmpty() }.take(3)

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        // Welcome Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                modifier = Modifier.size(48.dp),
                shape = CircleShape,
                color = SanctusIndigo
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text("LP", fontWeight = FontWeight.Bold, color = Color.White, fontSize = 18.sp)
                }
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                Text(
                    text = "Welcome back, Pastor Thomas",
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp,
                    color = Color.White
                )
                Text(
                    text = "Life Changer Prophetical Church Overview",
                    fontSize = 12.sp,
                    color = MutedText
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Stats Cards (2x2 Grid)
        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                StatCard(
                    title = "Total Believers",
                    value = totalBelievers.toString(),
                    footer = "+4 this month",
                    icon = Icons.Default.Person,
                    iconColor = SanctusGold,
                    modifier = Modifier.weight(1f)
                )
                StatCard(
                    title = "Parish Families",
                    value = totalFamilies.toString(),
                    footer = "+1 new family",
                    icon = Icons.Default.Home,
                    iconColor = SanctusIndigo,
                    modifier = Modifier.weight(1f)
                )
            }
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                StatCard(
                    title = "Sunday Attendance",
                    value = "$attendanceRate%",
                    footer = "Avg. past 4 weeks",
                    icon = Icons.Default.Check,
                    iconColor = SanctusGreen,
                    modifier = Modifier.weight(1f)
                )
                StatCard(
                    title = "Study Completion",
                    value = "$studyRate%",
                    footer = "+8% vs last week",
                    icon = Icons.Default.Star,
                    iconColor = Color(0xFFEC4899),
                    modifier = Modifier.weight(1f)
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Pastoral Tasks Section
        SectionHeader(title = "Pastoral Tasks")
        Spacer(modifier = Modifier.height(8.dp))

        if (activeTasks.isEmpty()) {
            Text(
                "No pending pastoral duties.",
                color = MutedText,
                fontSize = 13.sp,
                modifier = Modifier.padding(vertical = 12.dp)
            )
        } else {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                activeTasks.forEach { task ->
                    val urgencyColor = when (task.urgency) {
                        "Critical" -> SanctusRed
                        "Urgent" -> SanctusGold
                        else -> SanctusIndigo
                    }
                    Surface(
                        color = MaterialTheme.colorScheme.surface,
                        shape = RoundedCornerShape(10.dp),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.secondary),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Surface(
                                    color = urgencyColor.copy(alpha = 0.15f),
                                    shape = RoundedCornerShape(4.dp)
                                ) {
                                    Text(
                                        task.urgency,
                                        fontSize = 9.sp,
                                        color = urgencyColor,
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                    )
                                }
                                val pastorName = if (task.pastorId == "p1") "Pr. Joseph" else if (task.pastorId == "p2") "Pr. Matthew" else "Pr. Luke"
                                Text("Assigned: $pastorName", fontSize = 11.sp, color = MutedText)
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(task.title, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color.White)
                            Text(task.desc, fontSize = 12.sp, color = MutedText, modifier = Modifier.padding(top = 2.dp))
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Recent Newcomers Section
        SectionHeader(title = "Recent Newcomers")
        Spacer(modifier = Modifier.height(8.dp))

        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            sortedNewcomers.forEach { believer ->
                Surface(
                    color = MaterialTheme.colorScheme.surface,
                    shape = RoundedCornerShape(10.dp),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.secondary),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            modifier = Modifier.size(36.dp),
                            shape = CircleShape,
                            color = SanctusIndigo.copy(alpha = 0.2f)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                val initials = believer.name.split(" ").map { it.first() }.joinToString("").take(2).uppercase()
                                Text(initials, color = SanctusIndigo, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(believer.name, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color.White)
                            Text("Joined: ${believer.dateJoined} • ${believer.location}", fontSize = 11.sp, color = MutedText)
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Urgent Prayer Section
        SectionHeader(title = "Prayer Wall")
        Spacer(modifier = Modifier.height(8.dp))

        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            prayerRequests.forEach { believer ->
                Surface(
                    color = MaterialTheme.colorScheme.surface,
                    shape = RoundedCornerShape(10.dp),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.secondary),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(believer.name, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Color.White)
                            Text("Location: ${believer.location}", fontSize = 11.sp, color = MutedText)
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "\"${believer.prayerRequests}\"",
                            fontSize = 12.sp,
                            color = MutedText,
                            lineHeight = 16.sp
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun StatCard(
    title: String,
    value: String,
    footer: String,
    icon: ImageVector,
    iconColor: Color,
    modifier: Modifier = Modifier
) {
    Surface(
        color = MaterialTheme.colorScheme.surface,
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.secondary),
        modifier = modifier
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(title, fontSize = 12.sp, color = MutedText, fontWeight = FontWeight.Medium)
                Surface(
                    shape = CircleShape,
                    color = iconColor.copy(alpha = 0.15f),
                    modifier = Modifier.size(28.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(icon, contentDescription = null, tint = iconColor, modifier = Modifier.size(16.dp))
                    }
                }
            }
            Spacer(modifier = Modifier.height(6.dp))
            Text(value, fontSize = 22.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Spacer(modifier = Modifier.height(4.dp))
            Text(footer, fontSize = 10.sp, color = MutedText)
        }
    }
}

@Composable
fun SectionHeader(title: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = title,
            fontWeight = FontWeight.Bold,
            fontSize = 15.sp,
            color = SanctusGold
        )
        Spacer(modifier = Modifier.width(8.dp))
        Divider(color = MaterialTheme.colorScheme.secondary.copy(alpha = 0.5f))
    }
}
