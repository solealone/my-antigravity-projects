package com.example.sanctusmobile.ui.pastors

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.sanctusmobile.data.Believer
import com.example.sanctusmobile.data.Pastor
import com.example.sanctusmobile.data.Task
import com.example.sanctusmobile.theme.*
import com.example.sanctusmobile.ui.main.MainScreenViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PastorsScreen(
    viewModel: MainScreenViewModel,
    modifier: Modifier = Modifier
) {
    val pastors by viewModel.pastors.collectAsState()
    val believers by viewModel.believers.collectAsState()
    val tasks by viewModel.tasks.collectAsState()

    var taskFilter by remember { mutableStateOf("all") } // "all", "pending", "in_progress", "completed"
    var showAssignTaskDialog by remember { mutableStateOf(false) }

    val filteredTasks = tasks.filter { t ->
        taskFilter == "all" || t.status == taskFilter
    }

    Box(modifier = modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
        Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
            // Title & Actions
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Pastoral Staff",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Text(
                        text = "Track workload and delegate duties",
                        style = MaterialTheme.typography.bodySmall,
                        color = MutedText
                    )
                }
                Button(
                    onClick = { showAssignTaskDialog = true },
                    colors = ButtonDefaults.buttonColors(containerColor = SanctusIndigo),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Icon(Icons.Default.Add, contentDescription = "New Task", modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("New Task", fontSize = 12.sp)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Roster Cards (Horizontal or Column layout)
            Text("Ministry Workloads", fontWeight = FontWeight.SemiBold, fontSize = 14.sp, color = SanctusGold)
            Spacer(modifier = Modifier.height(8.dp))

            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                pastors.forEach { pastor ->
                    val pastorBelievers = believers.filter { it.pastorId == pastor.id }
                    val activeTasks = tasks.filter { it.pastorId == pastor.id && it.status != "completed" }
                    val workload = Math.min(100, Math.round(((pastorBelievers.size + (activeTasks.size * 2)) / 20.0) * 100).toInt())

                    PastorCard(
                        pastor = pastor,
                        believerCount = pastorBelievers.size,
                        taskCount = activeTasks.size,
                        workloadPercentage = workload
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Task Management Header and tabs
            Text("Pastoral Tasks", fontWeight = FontWeight.SemiBold, fontSize = 14.sp, color = SanctusGold)
            Spacer(modifier = Modifier.height(8.dp))

            // Filter Tabs
            ScrollableTabRow(
                selectedTabIndex = when (taskFilter) {
                    "all" -> 0
                    "pending" -> 1
                    "in_progress" -> 2
                    else -> 3
                },
                containerColor = Color.Transparent,
                contentColor = SanctusIndigo,
                edgePadding = 0.dp,
                divider = { Divider(color = MaterialTheme.colorScheme.secondary) }
            ) {
                Tab(selected = taskFilter == "all", onClick = { taskFilter = "all" }, text = { Text("All", fontSize = 12.sp) })
                Tab(selected = taskFilter == "pending", onClick = { taskFilter = "pending" }, text = { Text("Pending", fontSize = 12.sp) })
                Tab(selected = taskFilter == "in_progress", onClick = { taskFilter = "in_progress" }, text = { Text("In Progress", fontSize = 12.sp) })
                Tab(selected = taskFilter == "completed", onClick = { taskFilter = "completed" }, text = { Text("Completed", fontSize = 12.sp) })
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Tasks List
            if (filteredTasks.isEmpty()) {
                Box(modifier = Modifier.weight(1f).fillMaxWidth(), contentAlignment = Alignment.Center) {
                    Text("No tasks found under this filter.", color = MutedText)
                }
            } else {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.weight(1f).fillMaxWidth()
                ) {
                    items(filteredTasks) { task ->
                        val assignedPastor = pastors.find { it.id == task.pastorId }
                        val relatedBeliever = believers.find { it.id == task.believerId }
                        TaskCard(
                            task = task,
                            pastor = assignedPastor,
                            believer = relatedBeliever,
                            onToggleStatus = { viewModel.toggleTaskStatus(task.id) },
                            onDelete = { viewModel.deleteTask(task.id) }
                        )
                    }
                }
            }
        }

        // Assign Task Dialog
        if (showAssignTaskDialog) {
            AssignTaskDialog(
                pastors = pastors,
                believers = believers,
                onDismiss = { showAssignTaskDialog = false },
                onConfirm = { title, desc, pastorId, urgency, believerId ->
                    viewModel.assignTask(title, desc, pastorId, urgency, believerId)
                    showAssignTaskDialog = false
                }
            )
        }
    }
}

@Composable
fun PastorCard(
    pastor: Pastor,
    believerCount: Int,
    taskCount: Int,
    workloadPercentage: Int
) {
    Surface(
        color = MaterialTheme.colorScheme.surface,
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.secondary),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Avatar
            Surface(
                modifier = Modifier.size(44.dp),
                shape = CircleShape,
                color = SanctusIndigo.copy(alpha = 0.2f)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(
                        text = pastor.avatar,
                        fontWeight = FontWeight.Bold,
                        color = SanctusIndigo,
                        fontSize = 16.sp
                    )
                }
            }

            Spacer(modifier = Modifier.width(12.dp))

            // Details
            Column(modifier = Modifier.weight(1f)) {
                Text(pastor.name, fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color.White)
                Text("${pastor.district} • $believerCount Believers", fontSize = 12.sp, color = MutedText)
                Text("Active Tasks: $taskCount", fontSize = 11.sp, color = MutedText, modifier = Modifier.padding(top = 2.dp))
                
                Spacer(modifier = Modifier.height(6.dp))
                // Workload Bar
                val progressColor = when {
                    workloadPercentage > 80 -> SanctusRed
                    workloadPercentage > 50 -> SanctusGold
                    else -> SanctusIndigo
                }
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(6.dp)
                        .background(MaterialTheme.colorScheme.secondary, RoundedCornerShape(3.dp))
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth(workloadPercentage / 100f)
                            .height(6.dp)
                            .background(progressColor, RoundedCornerShape(3.dp))
                    )
                }
            }
            Spacer(modifier = Modifier.width(8.dp))
            Text("$workloadPercentage%", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.White)
        }
    }
}

@Composable
fun TaskCard(
    task: Task,
    pastor: Pastor?,
    believer: Believer?,
    onToggleStatus: () -> Unit,
    onDelete: () -> Unit
) {
    val urgencyColor = when (task.urgency) {
        "Critical" -> SanctusRed
        "Urgent" -> SanctusGold
        else -> SanctusIndigo
    }

    val statusLabel = when (task.status) {
        "pending" -> "Pending"
        "in_progress" -> "In Progress"
        else -> "Completed"
    }

    val statusColor = when (task.status) {
        "pending" -> SanctusGold
        "in_progress" -> SanctusIndigo
        else -> SanctusGreen
    }

    Surface(
        color = MaterialTheme.colorScheme.surface,
        shape = RoundedCornerShape(10.dp),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.secondary),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            // Badges
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    Surface(color = statusColor.copy(alpha = 0.15f), shape = RoundedCornerShape(4.dp)) {
                        Text(statusLabel, fontSize = 9.sp, fontWeight = FontWeight.Bold, color = statusColor, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                    }
                    Surface(color = urgencyColor.copy(alpha = 0.15f), shape = RoundedCornerShape(4.dp)) {
                        Text(task.urgency, fontSize = 9.sp, fontWeight = FontWeight.Bold, color = urgencyColor, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                    }
                }
                IconButton(onClick = onDelete, modifier = Modifier.size(20.dp)) {
                    Icon(Icons.Default.Delete, contentDescription = "Delete Task", tint = SanctusRed.copy(alpha = 0.7f), modifier = Modifier.size(16.dp))
                }
            }

            Spacer(modifier = Modifier.height(6.dp))
            
            Text(task.title, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color.White)
            Text(task.desc, fontSize = 12.sp, color = MutedText, modifier = Modifier.padding(top = 2.dp))

            Spacer(modifier = Modifier.height(8.dp))
            Divider(color = MaterialTheme.colorScheme.secondary.copy(alpha = 0.5f))
            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Assigned to: ${pastor?.name ?: "Unassigned"}",
                        fontSize = 11.sp,
                        color = MutedText
                    )
                    if (believer != null) {
                        Text(
                            text = "Believer: ${believer.name}",
                            fontSize = 11.sp,
                            color = MutedText,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
                Button(
                    onClick = onToggleStatus,
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary),
                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                    modifier = Modifier.height(28.dp)
                ) {
                    Text(
                        text = when (task.status) {
                            "pending" -> "Start"
                            "in_progress" -> "Complete"
                            else -> "Reopen"
                        },
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AssignTaskDialog(
    pastors: List<Pastor>,
    believers: List<Believer>,
    onDismiss: () -> Unit,
    onConfirm: (title: String, desc: String, pastorId: String, urgency: String, believerId: String) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var desc by remember { mutableStateOf("") }
    var selectedPastorId by remember { mutableStateOf(pastors.firstOrNull()?.id ?: "") }
    var urgency by remember { mutableStateOf("Standard") }
    var selectedBelieverId by remember { mutableStateOf("") }

    var showPastorMenu by remember { mutableStateOf(false) }
    var showUrgencyMenu by remember { mutableStateOf(false) }
    var showBelieverMenu by remember { mutableStateOf(false) }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.secondary),
            modifier = Modifier.fillMaxWidth().verticalScroll(rememberScrollState())
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text(
                    text = "Assign Care Task",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Spacer(modifier = Modifier.height(16.dp))

                Text("Task Title *", fontSize = 12.sp, color = MutedText)
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    placeholder = { Text("e.g. Visit the Williams family", color = MutedText, fontSize = 14.sp) },
                    modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
                    colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = SanctusIndigo, unfocusedBorderColor = MaterialTheme.colorScheme.secondary)
                )

                Spacer(modifier = Modifier.height(12.dp))

                Text("Description", fontSize = 12.sp, color = MutedText)
                OutlinedTextField(
                    value = desc,
                    onValueChange = { desc = it },
                    placeholder = { Text("Details of counseling or visitation...", color = MutedText, fontSize = 14.sp) },
                    modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
                    colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = SanctusIndigo, unfocusedBorderColor = MaterialTheme.colorScheme.secondary),
                    minLines = 2
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Pastor & Urgency select
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Column(modifier = Modifier.weight(1.2f)) {
                        Text("Assign To *", fontSize = 12.sp, color = MutedText)
                        Box(modifier = Modifier.fillMaxWidth().padding(top = 4.dp)) {
                            Surface(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .border(1.dp, MaterialTheme.colorScheme.secondary, RoundedCornerShape(8.dp))
                                    .clickable { showPastorMenu = true },
                                color = MaterialTheme.colorScheme.surface,
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 14.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    val pastorName = pastors.find { it.id == selectedPastorId }?.name ?: "Select"
                                    Text(pastorName, fontSize = 14.sp, color = Color.White)
                                    Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = MutedText)
                                }
                            }
                            DropdownMenu(
                                expanded = showPastorMenu,
                                onDismissRequest = { showPastorMenu = false },
                                modifier = Modifier.background(MaterialTheme.colorScheme.surface)
                            ) {
                                pastors.forEach { pastor ->
                                    DropdownMenuItem(
                                        text = { Text(pastor.name, color = Color.White) },
                                        onClick = {
                                            selectedPastorId = pastor.id
                                            showPastorMenu = false
                                        }
                                    )
                                }
                            }
                        }
                    }

                    Column(modifier = Modifier.weight(1f)) {
                        Text("Urgency *", fontSize = 12.sp, color = MutedText)
                        Box(modifier = Modifier.fillMaxWidth().padding(top = 4.dp)) {
                            Surface(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .border(1.dp, MaterialTheme.colorScheme.secondary, RoundedCornerShape(8.dp))
                                    .clickable { showUrgencyMenu = true },
                                color = MaterialTheme.colorScheme.surface,
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 14.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(urgency, fontSize = 14.sp, color = Color.White)
                                    Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = MutedText)
                                }
                            }
                            DropdownMenu(
                                expanded = showUrgencyMenu,
                                onDismissRequest = { showUrgencyMenu = false },
                                modifier = Modifier.background(MaterialTheme.colorScheme.surface)
                            ) {
                                listOf("Standard", "Urgent", "Critical").forEach { urg ->
                                    DropdownMenuItem(
                                        text = { Text(urg, color = Color.White) },
                                        onClick = {
                                            urgency = urg
                                            showUrgencyMenu = false
                                        }
                                    )
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Believer Association
                Text("Related Believer", fontSize = 12.sp, color = MutedText)
                Box(modifier = Modifier.fillMaxWidth().padding(top = 4.dp)) {
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(1.dp, MaterialTheme.colorScheme.secondary, RoundedCornerShape(8.dp))
                            .clickable { showBelieverMenu = true },
                        color = MaterialTheme.colorScheme.surface,
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 14.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            val believerName = if (selectedBelieverId.isEmpty()) "None (General Administrative Task)" else believers.find { it.id == selectedBelieverId }?.name ?: "None"
                            Text(believerName, fontSize = 14.sp, color = Color.White)
                            Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = MutedText)
                        }
                    }
                    DropdownMenu(
                        expanded = showBelieverMenu,
                        onDismissRequest = { showBelieverMenu = false },
                        modifier = Modifier.background(MaterialTheme.colorScheme.surface)
                    ) {
                        DropdownMenuItem(
                            text = { Text("None (General Administrative Task)", color = Color.White) },
                            onClick = {
                                selectedBelieverId = ""
                                showBelieverMenu = false
                            }
                        )
                        believers.forEach { b ->
                            DropdownMenuItem(
                                text = { Text(b.name, color = Color.White) },
                                onClick = {
                                    selectedBelieverId = b.id
                                    showBelieverMenu = false
                                }
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TextButton(onClick = onDismiss, colors = ButtonDefaults.textButtonColors(contentColor = Color.White)) {
                        Text("Cancel")
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Button(
                        onClick = {
                            if (title.isNotEmpty()) {
                                onConfirm(title, desc, selectedPastorId, urgency, selectedBelieverId)
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = SanctusIndigo),
                        enabled = title.isNotEmpty()
                    ) {
                        Text("Assign Task")
                    }
                }
            }
        }
    }
}
