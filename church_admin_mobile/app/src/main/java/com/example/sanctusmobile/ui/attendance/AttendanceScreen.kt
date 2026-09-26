package com.example.sanctusmobile.ui.attendance

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.sanctusmobile.data.Believer
import com.example.sanctusmobile.data.Family
import com.example.sanctusmobile.data.Pastor
import com.example.sanctusmobile.theme.*
import com.example.sanctusmobile.ui.main.MainScreenViewModel

@Composable
fun AttendanceScreen(
    viewModel: MainScreenViewModel,
    modifier: Modifier = Modifier
) {
    val believers by viewModel.believers.collectAsState()
    val families by viewModel.families.collectAsState()
    val pastors by viewModel.pastors.collectAsState()
    val attendance by viewModel.attendance.collectAsState()

    val datesList = listOf("2026-06-07", "2026-05-31", "2026-05-24")
    var selectedDate by remember { mutableStateOf(datesList.first()) }
    var showDateDropdown by remember { mutableStateOf(false) }

    val dateAttendanceMap = attendance[selectedDate] ?: emptyMap()

    Box(modifier = modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
        Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
            // Title & Date Selector
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Attendance Log",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Text(
                        text = "Mark and review Sunday service attendance",
                        style = MaterialTheme.typography.bodySmall,
                        color = MutedText
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Date Selector dropdown
            Text("Service Date", fontSize = 12.sp, color = MutedText)
            Spacer(modifier = Modifier.height(4.dp))
            Box(modifier = Modifier.fillMaxWidth()) {
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, MaterialTheme.colorScheme.secondary, RoundedCornerShape(8.dp))
                        .clickable { showDateDropdown = true },
                    color = MaterialTheme.colorScheme.surface,
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        val formattedDate = when (selectedDate) {
                            "2026-06-07" -> "Sunday, June 7, 2026"
                            "2026-05-31" -> "Sunday, May 31, 2026"
                            "2026-05-24" -> "Sunday, May 24, 2026"
                            else -> selectedDate
                        }
                        Text(formattedDate, fontSize = 14.sp, color = Color.White)
                        Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = MutedText)
                    }
                }
                DropdownMenu(
                    expanded = showDateDropdown,
                    onDismissRequest = { showDateDropdown = false },
                    modifier = Modifier.fillMaxWidth().background(MaterialTheme.colorScheme.surface)
                ) {
                    datesList.forEach { date ->
                        val formattedDateOption = when (date) {
                            "2026-06-07" -> "Sunday, June 7, 2026"
                            "2026-05-31" -> "Sunday, May 31, 2026"
                            "2026-05-24" -> "Sunday, May 24, 2026"
                            else -> date
                        }
                        DropdownMenuItem(
                            text = { Text(formattedDateOption, color = Color.White) },
                            onClick = {
                                selectedDate = date
                                showDateDropdown = false
                            }
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Believers Checklist
            Text("Believers Roster", fontWeight = FontWeight.SemiBold, fontSize = 14.sp, color = SanctusGold)
            Spacer(modifier = Modifier.height(8.dp))

            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(believers) { believer ->
                    val isPresent = dateAttendanceMap[believer.id] == true
                    val family = families.find { it.id == believer.familyId }
                    val pastor = pastors.find { it.id == believer.pastorId }
                    
                    AttendanceCheckRow(
                        believer = believer,
                        family = family,
                        pastor = pastor,
                        isPresent = isPresent,
                        onToggle = { viewModel.toggleAttendance(selectedDate, believer.id) }
                    )
                }
            }
        }
    }
}

@Composable
fun AttendanceCheckRow(
    believer: Believer,
    family: Family?,
    pastor: Pastor?,
    isPresent: Boolean,
    onToggle: () -> Unit
) {
    Surface(
        color = MaterialTheme.colorScheme.surface,
        shape = RoundedCornerShape(10.dp),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.secondary),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(believer.name, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color.White)
                Text(
                    text = "${family?.name ?: "Individual Member"} • Pr. ${pastor?.name?.replace("Pastor ", "") ?: "Unassigned"}",
                    fontSize = 11.sp,
                    color = MutedText
                )
            }
            
            Button(
                onClick = onToggle,
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isPresent) SanctusGreen.copy(alpha = 0.2f) else SanctusRed.copy(alpha = 0.2f),
                    contentColor = if (isPresent) SanctusGreen else SanctusRed
                ),
                border = BorderStroke(1.dp, if (isPresent) SanctusGreen.copy(alpha = 0.5f) else SanctusRed.copy(alpha = 0.5f)),
                contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp),
                modifier = Modifier.height(32.dp)
            ) {
                Text(
                    text = if (isPresent) "Present" else "Absent",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}
