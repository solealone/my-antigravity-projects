package com.example.sanctusmobile.ui.study

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.sanctusmobile.data.Believer
import com.example.sanctusmobile.data.Pastor
import com.example.sanctusmobile.data.StudyPlan
import com.example.sanctusmobile.theme.*
import com.example.sanctusmobile.ui.main.MainScreenViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BibleStudyScreen(
    viewModel: MainScreenViewModel,
    modifier: Modifier = Modifier
) {
    val currentPlan by viewModel.currentStudyPlan.collectAsState()
    val believers by viewModel.believers.collectAsState()
    val pastors by viewModel.pastors.collectAsState()

    var showNewPlanDialog by remember { mutableStateOf(false) }

    Box(modifier = modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
        Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
            // Title & Publish Button
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Bible Studies",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Text(
                        text = "Publish and track spiritual lessons",
                        style = MaterialTheme.typography.bodySmall,
                        color = MutedText
                    )
                }
                Button(
                    onClick = { showNewPlanDialog = true },
                    colors = ButtonDefaults.buttonColors(containerColor = SanctusIndigo),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Text("Publish Daily", fontSize = 12.sp)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Current Active Plan Card
            Text("Active Study Plan", fontWeight = FontWeight.SemiBold, fontSize = 14.sp, color = SanctusGold)
            Spacer(modifier = Modifier.height(8.dp))

            currentPlan?.let { plan ->
                Surface(
                    color = MaterialTheme.colorScheme.surface,
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.secondary),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(plan.title, fontWeight = FontWeight.Bold, fontSize = 16.sp, color = SanctusGold)
                        
                        Spacer(modifier = Modifier.height(4.dp))
                        Surface(
                            color = SanctusIndigo.copy(alpha = 0.15f),
                            shape = RoundedCornerShape(4.dp)
                        ) {
                            Text(
                                text = plan.scripture,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = SanctusIndigo,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }

                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            text = "\"${plan.content}\"",
                            fontSize = 13.sp,
                            fontStyle = FontStyle.Italic,
                            color = Color.White,
                            lineHeight = 18.sp
                        )

                        Spacer(modifier = Modifier.height(12.dp))
                        Surface(
                            color = MaterialTheme.colorScheme.secondary,
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(10.dp)) {
                                Text("Action Item", fontWeight = FontWeight.Bold, fontSize = 11.sp, color = SanctusGold)
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(plan.action, fontSize = 12.sp, color = Color.White)
                            }
                        }
                    }
                }
            } ?: Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(100.dp)
                    .border(1.dp, MaterialTheme.colorScheme.secondary, RoundedCornerShape(12.dp)),
                contentAlignment = Alignment.Center
            ) {
                Text("No study plan published yet.", color = MutedText)
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Believer Discipleship Growth Checkoff Table
            Text("Believer Discipleship Growth", fontWeight = FontWeight.SemiBold, fontSize = 14.sp, color = SanctusGold)
            Spacer(modifier = Modifier.height(8.dp))

            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.weight(1f).fillMaxWidth()
            ) {
                items(believers) { believer ->
                    val assignedPastor = pastors.find { it.id == believer.pastorId }
                    StudyCheckoffRow(
                        believer = believer,
                        pastor = assignedPastor,
                        onCheckedChange = { viewModel.toggleStudyCompletion(believer.id) }
                    )
                }
            }
        }

        // Publish new Daily Bible study dialog
        if (showNewPlanDialog) {
            PublishStudyDialog(
                onDismiss = { showNewPlanDialog = false },
                onConfirm = { title, scripture, content, action ->
                    viewModel.publishStudyPlan(title, scripture, content, action)
                    showNewPlanDialog = false
                }
            )
        }
    }
}

@Composable
fun StudyCheckoffRow(
    believer: Believer,
    pastor: Pastor?,
    onCheckedChange: (Boolean) -> Unit
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
                    text = "Pr. ${pastor?.name?.replace("Pastor ", "") ?: "Unassigned"} • Growth: ${believer.growthRate}%",
                    fontSize = 11.sp,
                    color = MutedText
                )
                
                Spacer(modifier = Modifier.height(4.dp))
                // Small visual growth percentage bar
                Box(
                    modifier = Modifier
                        .width(100.dp)
                        .height(4.dp)
                        .background(MaterialTheme.colorScheme.secondary, RoundedCornerShape(2.dp))
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth(believer.growthRate / 100f)
                            .height(4.dp)
                            .background(SanctusGreen, RoundedCornerShape(2.dp))
                    )
                }
            }
            
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = if (believer.studyCompleted) "Completed" else "Pending",
                    fontSize = 11.sp,
                    color = if (believer.studyCompleted) SanctusGreen else MutedText,
                    modifier = Modifier.padding(end = 6.dp)
                )
                Checkbox(
                    checked = believer.studyCompleted,
                    onCheckedChange = onCheckedChange,
                    colors = CheckboxDefaults.colors(
                        checkedColor = SanctusGreen,
                        uncheckedColor = MutedText
                    )
                )
            }
        }
    }
}

@Composable
fun PublishStudyDialog(
    onDismiss: () -> Unit,
    onConfirm: (title: String, scripture: String, content: String, action: String) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var scripture by remember { mutableStateOf("") }
    var content by remember { mutableStateOf("") }
    var action by remember { mutableStateOf("") }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.secondary),
            modifier = Modifier.fillMaxWidth().verticalScroll(rememberScrollState())
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text(
                    text = "Publish Daily Bible Study",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Spacer(modifier = Modifier.height(16.dp))

                Text("Lesson Title *", fontSize = 12.sp, color = MutedText)
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    placeholder = { Text("e.g. The Power of Grace", color = MutedText, fontSize = 14.sp) },
                    modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
                    colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = SanctusIndigo, unfocusedBorderColor = MaterialTheme.colorScheme.secondary)
                )

                Spacer(modifier = Modifier.height(12.dp))

                Text("Scripture Reference *", fontSize = 12.sp, color = MutedText)
                OutlinedTextField(
                    value = scripture,
                    onValueChange = { scripture = it },
                    placeholder = { Text("e.g. Ephesians 2:8-9", color = MutedText, fontSize = 14.sp) },
                    modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
                    colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = SanctusIndigo, unfocusedBorderColor = MaterialTheme.colorScheme.secondary)
                )

                Spacer(modifier = Modifier.height(12.dp))

                Text("Teaching Commentary / Reflection *", fontSize = 12.sp, color = MutedText)
                OutlinedTextField(
                    value = content,
                    onValueChange = { content = it },
                    placeholder = { Text("Write the reflection guide details...", color = MutedText, fontSize = 14.sp) },
                    modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
                    colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = SanctusIndigo, unfocusedBorderColor = MaterialTheme.colorScheme.secondary),
                    minLines = 3
                )

                Spacer(modifier = Modifier.height(12.dp))

                Text("Action Plan Item *", fontSize = 12.sp, color = MutedText)
                OutlinedTextField(
                    value = action,
                    onValueChange = { action = it },
                    placeholder = { Text("e.g. Pray with someone this week", color = MutedText, fontSize = 14.sp) },
                    modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
                    colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = SanctusIndigo, unfocusedBorderColor = MaterialTheme.colorScheme.secondary)
                )

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
                            if (title.isNotEmpty() && scripture.isNotEmpty() && content.isNotEmpty() && action.isNotEmpty()) {
                                onConfirm(title, scripture, content, action)
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = SanctusIndigo),
                        enabled = title.isNotEmpty() && scripture.isNotEmpty() && content.isNotEmpty() && action.isNotEmpty()
                    ) {
                        Text("Publish Study")
                    }
                }
            }
        }
    }
}
