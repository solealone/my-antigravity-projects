package com.example.sanctusmobile.ui.directory

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.Search
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
import com.example.sanctusmobile.data.Family
import com.example.sanctusmobile.data.Pastor
import com.example.sanctusmobile.theme.SanctusGold
import com.example.sanctusmobile.theme.SanctusIndigo
import com.example.sanctusmobile.theme.MutedText
import com.example.sanctusmobile.theme.SanctusGreen
import com.example.sanctusmobile.theme.SanctusRed
import com.example.sanctusmobile.ui.main.MainScreenViewModel
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DirectoryScreen(
    viewModel: MainScreenViewModel,
    modifier: Modifier = Modifier
) {
    val believers by viewModel.believers.collectAsState()
    val families by viewModel.families.collectAsState()
    val pastors by viewModel.pastors.collectAsState()

    var searchQuery by remember { mutableStateOf("") }
    var filterBaptism by remember { mutableStateOf("All") }
    var filterPastorId by remember { mutableStateOf("all") }
    var currentSubTab by remember { mutableStateOf("Families") } // "Families" or "Individuals"

    var showAddFamilyDialog by remember { mutableStateOf(false) }
    var showAddMemberDialog by remember { mutableStateOf(false) }

    // Filtered believers
    val filteredBelievers = believers.filter { b ->
        val matchesSearch = b.name.contains(searchQuery, ignoreCase = true) ||
                b.email.contains(searchQuery, ignoreCase = true) ||
                b.phone.contains(searchQuery) ||
                b.location.contains(searchQuery, ignoreCase = true)
        val matchesBaptism = when (filterBaptism) {
            "Baptized" -> b.baptismStatus == "Baptized"
            "Non-Baptized" -> b.baptismStatus == "Non-Baptized"
            else -> true
        }
        val matchesPastor = filterPastorId == "all" || b.pastorId == filterPastorId
        matchesSearch && matchesBaptism && matchesPastor
    }

    // Filtered families
    val filteredFamilies = families.filter { f ->
        val matchesSearch = f.name.contains(searchQuery, ignoreCase = true) ||
                f.location.contains(searchQuery, ignoreCase = true)
        val matchesPastor = filterPastorId == "all" || f.pastorId == filterPastorId
        
        val familyMembers = believers.filter { it.familyId == f.id }
        val hasMatchingMembers = familyMembers.any { b ->
            b.name.contains(searchQuery, ignoreCase = true) ||
            (filterBaptism == "Baptized" && b.baptismStatus == "Baptized") ||
            (filterBaptism == "Non-Baptized" && b.baptismStatus == "Non-Baptized")
        }
        matchesPastor && (matchesSearch || hasMatchingMembers)
    }

    Box(modifier = modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
        Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
            // Title & Add Buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Parish Directory",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Text(
                        text = "Manage families and individuals",
                        style = MaterialTheme.typography.bodySmall,
                        color = MutedText
                    )
                }
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(
                        onClick = { showAddFamilyDialog = true },
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = "Add Family", modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Family", fontSize = 12.sp)
                    }
                    Button(
                        onClick = { showAddMemberDialog = true },
                        colors = ButtonDefaults.buttonColors(containerColor = SanctusIndigo),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = "Add Member", modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Member", fontSize = 12.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Search and Filters bar
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("Search by name, phone, location...", color = MutedText, fontSize = 14.sp) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search", tint = MutedText) },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = SanctusIndigo,
                    unfocusedBorderColor = MaterialTheme.colorScheme.secondary,
                    focusedContainerColor = MaterialTheme.colorScheme.surface,
                    unfocusedContainerColor = MaterialTheme.colorScheme.surface
                )
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Dropdown filters & Tab Toggle
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Baptism filter select
                var showBaptismMenu by remember { mutableStateOf(false) }
                Box(modifier = Modifier.weight(1f)) {
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(1.dp, MaterialTheme.colorScheme.secondary, RoundedCornerShape(8.dp))
                            .clickable { showBaptismMenu = true },
                        color = MaterialTheme.colorScheme.surface,
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(filterBaptism, fontSize = 12.sp, color = Color.White)
                            Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = MutedText)
                        }
                    }
                    DropdownMenu(
                        expanded = showBaptismMenu,
                        onDismissRequest = { showBaptismMenu = false },
                        modifier = Modifier.background(MaterialTheme.colorScheme.surface)
                    ) {
                        listOf("All", "Baptized", "Non-Baptized").forEach { option ->
                            DropdownMenuItem(
                                text = { Text(option, color = Color.White) },
                                onClick = {
                                    filterBaptism = option
                                    showBaptismMenu = false
                                }
                            )
                        }
                    }
                }

                // Pastor filter select
                var showPastorMenu by remember { mutableStateOf(false) }
                Box(modifier = Modifier.weight(1f)) {
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(1.dp, MaterialTheme.colorScheme.secondary, RoundedCornerShape(8.dp))
                            .clickable { showPastorMenu = true },
                        color = MaterialTheme.colorScheme.surface,
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            val activePastorName = if (filterPastorId == "all") "All Pastors" else pastors.find { it.id == filterPastorId }?.name ?: "All Pastors"
                            Text(activePastorName, fontSize = 12.sp, color = Color.White, maxLines = 1)
                            Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = MutedText)
                        }
                    }
                    DropdownMenu(
                        expanded = showPastorMenu,
                        onDismissRequest = { showPastorMenu = false },
                        modifier = Modifier.background(MaterialTheme.colorScheme.surface)
                    ) {
                        DropdownMenuItem(
                            text = { Text("All Pastors", color = Color.White) },
                            onClick = {
                                filterPastorId = "all"
                                showPastorMenu = false
                            }
                        )
                        pastors.forEach { pastor ->
                            DropdownMenuItem(
                                text = { Text(pastor.name, color = Color.White) },
                                onClick = {
                                    filterPastorId = pastor.id
                                    showPastorMenu = false
                                }
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Sub Tab Selector
            TabRow(
                selectedTabIndex = if (currentSubTab == "Families") 0 else 1,
                containerColor = Color.Transparent,
                contentColor = SanctusIndigo,
                divider = { Divider(color = MaterialTheme.colorScheme.secondary) }
            ) {
                Tab(
                    selected = currentSubTab == "Families",
                    onClick = { currentSubTab = "Families" },
                    text = { Text("Families (${filteredFamilies.size})", fontWeight = FontWeight.SemiBold) }
                )
                Tab(
                    selected = currentSubTab == "Individuals",
                    onClick = { currentSubTab = "Individuals" },
                    text = { Text("Individuals (${filteredBelievers.size})", fontWeight = FontWeight.SemiBold) }
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Content List
            if (currentSubTab == "Families") {
                if (filteredFamilies.isEmpty()) {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text("No families found matching filters.", color = MutedText)
                    }
                } else {
                    LazyColumn(
                        verticalArrangement = Arrangement.spacedBy(12.dp),
                        modifier = Modifier.fillMaxSize()
                    ) {
                        items(filteredFamilies) { family ->
                            FamilyCard(
                                family = family,
                                members = believers.filter { it.familyId == family.id },
                                pastor = pastors.find { it.id == family.pastorId }
                            )
                        }
                    }
                }
            } else {
                if (filteredBelievers.isEmpty()) {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text("No believers found matching filters.", color = MutedText)
                    }
                } else {
                    LazyColumn(
                        verticalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.fillMaxSize()
                    ) {
                        items(filteredBelievers) { believer ->
                            var showDetailsDialog by remember { mutableStateOf(false) }
                            BelieverRowItem(
                                believer = believer,
                                family = families.find { it.id == believer.familyId },
                                pastor = pastors.find { it.id == believer.pastorId },
                                onClick = { showDetailsDialog = true }
                            )
                            if (showDetailsDialog) {
                                BelieverDetailsDialog(
                                    believer = believer,
                                    family = families.find { it.id == believer.familyId },
                                    pastor = pastors.find { it.id == believer.pastorId },
                                    onDismiss = { showDetailsDialog = false }
                                )
                            }
                        }
                    }
                }
            }
        }

        // Add Family Dialog
        if (showAddFamilyDialog) {
            AddFamilyDialog(
                pastors = pastors,
                onDismiss = { showAddFamilyDialog = false },
                onConfirm = { name, pastorId, location ->
                    viewModel.addFamily(name, pastorId, location)
                    showAddFamilyDialog = false
                }
            )
        }

        // Add Member Dialog
        if (showAddMemberDialog) {
            AddMemberDialog(
                pastors = pastors,
                families = families,
                onDismiss = { showAddMemberDialog = false },
                onConfirm = { name, gender, email, phone, address, location, dateJoined, religion, baptismStatus, familyId, role, pastorId, prayerRequests ->
                    viewModel.addBeliever(
                        name, gender, email, phone, address, location, dateJoined,
                        religion, baptismStatus, familyId, role, pastorId, prayerRequests
                    )
                    showAddMemberDialog = false
                }
            )
        }
    }
}

@Composable
fun FamilyCard(
    family: Family,
    members: List<Believer>,
    pastor: Pastor?
) {
    var expanded by remember { mutableStateOf(false) }
    Surface(
        color = MaterialTheme.colorScheme.surface,
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.secondary),
        modifier = Modifier.fillMaxWidth().clickable { expanded = !expanded }
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(family.name, fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Color.White)
                    Text("${family.location} • ${members.size} members", fontSize = 12.sp, color = MutedText)
                }
                Surface(
                    color = SanctusIndigo.copy(alpha = 0.15f),
                    shape = RoundedCornerShape(6.dp)
                ) {
                    Text(
                        text = pastor?.let { "Pr. ${it.name.replace("Pastor ", "")}" } ?: "Unassigned",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = SanctusIndigo,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }
            }

            AnimatedVisibility(visible = expanded) {
                Column(modifier = Modifier.padding(top = 12.dp)) {
                    Divider(color = MaterialTheme.colorScheme.secondary, modifier = Modifier.padding(bottom = 8.dp))
                    if (members.isEmpty()) {
                        Text("No members in family yet.", color = MutedText, fontSize = 12.sp)
                    } else {
                        members.forEach { member ->
                            Row(
                                modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(
                                        modifier = Modifier
                                            .size(8.dp)
                                            .background(
                                                color = if (member.gender == "Male") Color(0xFF60A5FA) else Color(0xFFF472B6),
                                                shape = RoundedCornerShape(4.dp)
                                            )
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(member.name, fontSize = 13.sp, color = Color.White)
                                }
                                Text(member.role, fontSize = 12.sp, color = MutedText)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun BelieverRowItem(
    believer: Believer,
    family: Family?,
    pastor: Pastor?,
    onClick: () -> Unit
) {
    Surface(
        color = MaterialTheme.colorScheme.surface,
        shape = RoundedCornerShape(10.dp),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.secondary),
        modifier = Modifier.fillMaxWidth().clickable { onClick() }
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(believer.name, fontWeight = FontWeight.SemiBold, fontSize = 14.sp, color = Color.White)
                Text(
                    text = if (family != null) "Family: ${family.name} (${believer.role})" else "Individual Member",
                    fontSize = 11.sp,
                    color = MutedText
                )
            }
            Column(horizontalAlignment = Alignment.End) {
                Surface(
                    color = if (believer.baptismStatus == "Baptized") SanctusGreen.copy(alpha = 0.15f) else SanctusRed.copy(alpha = 0.15f),
                    shape = RoundedCornerShape(6.dp),
                    modifier = Modifier.padding(bottom = 4.dp)
                ) {
                    Text(
                        text = believer.baptismStatus,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (believer.baptismStatus == "Baptized") SanctusGreen else SanctusRed,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                    )
                }
                Text(
                    text = pastor?.let { "Pr. ${it.name.replace("Pastor ", "")}" } ?: "Unassigned",
                    fontSize = 11.sp,
                    color = MutedText
                )
            }
        }
    }
}

@Composable
fun BelieverDetailsDialog(
    believer: Believer,
    family: Family?,
    pastor: Pastor?,
    onDismiss: () -> Unit
) {
    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.secondary),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text(
                    text = "Believer Details",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = SanctusGold
                )
                Spacer(modifier = Modifier.height(16.dp))

                DetailRow(label = "Name", value = "${believer.name} (${believer.gender})")
                DetailRow(label = "Status", value = believer.baptismStatus)
                DetailRow(label = "Joined Date", value = believer.dateJoined)
                DetailRow(label = "Religion of Origin", value = believer.religion.ifEmpty { "None" })
                DetailRow(label = "Assigned Pastor", value = pastor?.name ?: "Unassigned")
                DetailRow(label = "Family Group", value = family?.let { "${it.name} (${believer.role})" } ?: "None")
                DetailRow(label = "Phone", value = believer.phone)
                DetailRow(label = "Email", value = believer.email.ifEmpty { "N/A" })
                DetailRow(label = "Address", value = "${believer.address} (${believer.location})")
                
                Spacer(modifier = Modifier.height(12.dp))
                Divider(color = MaterialTheme.colorScheme.secondary)
                Spacer(modifier = Modifier.height(12.dp))
                
                Text("Prayer matters:", fontWeight = FontWeight.Bold, color = Color.White, fontSize = 12.sp)
                Text(
                    text = believer.prayerRequests.ifEmpty { "None registered" },
                    color = MutedText,
                    fontSize = 12.sp,
                    modifier = Modifier.padding(top = 4.dp)
                )

                Spacer(modifier = Modifier.height(12.dp))
                DetailRow(label = "Bible Study Completion", value = if (believer.studyCompleted) "Completed" else "Pending")
                DetailRow(label = "Growth Index", value = "${believer.growthRate}%")

                Spacer(modifier = Modifier.height(20.dp))
                Button(
                    onClick = onDismiss,
                    modifier = Modifier.align(Alignment.End),
                    colors = ButtonDefaults.buttonColors(containerColor = SanctusIndigo)
                ) {
                    Text("Close")
                }
            }
        }
    }
}

@Composable
fun DetailRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(label, color = MutedText, fontSize = 13.sp)
        Text(value, color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Medium)
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddFamilyDialog(
    pastors: List<Pastor>,
    onDismiss: () -> Unit,
    onConfirm: (name: String, pastorId: String, location: String) -> Unit
) {
    var name by remember { mutableStateOf("") }
    var location by remember { mutableStateOf("") }
    var selectedPastorId by remember { mutableStateOf(pastors.firstOrNull()?.id ?: "") }
    var showPastorMenu by remember { mutableStateOf(false) }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.secondary),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text(
                    text = "Create Family Group",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Spacer(modifier = Modifier.height(16.dp))

                Text("Family Surname / Title *", fontSize = 12.sp, color = MutedText)
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    placeholder = { Text("e.g. The Adams Family", color = MutedText, fontSize = 14.sp) },
                    modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
                    colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = SanctusIndigo, unfocusedBorderColor = MaterialTheme.colorScheme.secondary)
                )

                Spacer(modifier = Modifier.height(12.dp))

                Text("Assigned Pastor *", fontSize = 12.sp, color = MutedText)
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
                            val activePastorName = pastors.find { it.id == selectedPastorId }?.name ?: "Select Pastor"
                            Text(activePastorName, fontSize = 14.sp, color = Color.White)
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

                Spacer(modifier = Modifier.height(12.dp))

                Text("Location / District", fontSize = 12.sp, color = MutedText)
                OutlinedTextField(
                    value = location,
                    onValueChange = { location = it },
                    placeholder = { Text("e.g. North District", color = MutedText, fontSize = 14.sp) },
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
                        onClick = { if (name.isNotEmpty()) onConfirm(name, selectedPastorId, location) },
                        colors = ButtonDefaults.buttonColors(containerColor = SanctusIndigo),
                        enabled = name.isNotEmpty()
                    ) {
                        Text("Create Family")
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddMemberDialog(
    pastors: List<Pastor>,
    families: List<Family>,
    onDismiss: () -> Unit,
    onConfirm: (
        name: String, gender: String, email: String, phone: String,
        address: String, location: String, dateJoined: String,
        religion: String, baptismStatus: String, familyId: String,
        role: String, pastorId: String, prayerRequests: String
    ) -> Unit
) {
    var name by remember { mutableStateOf("") }
    var gender by remember { mutableStateOf("Male") }
    var email by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var address by remember { mutableStateOf("") }
    var location by remember { mutableStateOf("") }
    var dateJoined by remember { mutableStateOf(SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())) }
    var religion by remember { mutableStateOf("") }
    var baptismStatus by remember { mutableStateOf("Baptized") }
    var familyId by remember { mutableStateOf("") }
    var role by remember { mutableStateOf("Father") }
    var pastorId by remember { mutableStateOf(pastors.firstOrNull()?.id ?: "") }
    var prayerRequests by remember { mutableStateOf("") }

    var showGenderMenu by remember { mutableStateOf(false) }
    var showBaptismMenu by remember { mutableStateOf(false) }
    var showFamilyMenu by remember { mutableStateOf(false) }
    var showRoleMenu by remember { mutableStateOf(false) }
    var showPastorMenu by remember { mutableStateOf(false) }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.secondary),
            modifier = Modifier.fillMaxWidth().verticalScroll(rememberScrollState())
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text(
                    text = "Add New Believer",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Spacer(modifier = Modifier.height(16.dp))

                // Name
                Text("Full Name *", fontSize = 12.sp, color = MutedText)
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    placeholder = { Text("John Doe", color = MutedText, fontSize = 14.sp) },
                    modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
                    colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = SanctusIndigo, unfocusedBorderColor = MaterialTheme.colorScheme.secondary)
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Gender & Phone
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Gender *", fontSize = 12.sp, color = MutedText)
                        Box(modifier = Modifier.fillMaxWidth().padding(top = 4.dp)) {
                            Surface(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .border(1.dp, MaterialTheme.colorScheme.secondary, RoundedCornerShape(8.dp))
                                    .clickable { showGenderMenu = true },
                                color = MaterialTheme.colorScheme.surface,
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 14.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(gender, fontSize = 14.sp, color = Color.White)
                                    Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = MutedText)
                                }
                            }
                            DropdownMenu(
                                expanded = showGenderMenu,
                                onDismissRequest = { showGenderMenu = false },
                                modifier = Modifier.background(MaterialTheme.colorScheme.surface)
                            ) {
                                listOf("Male", "Female", "Other").forEach { g ->
                                    DropdownMenuItem(
                                        text = { Text(g, color = Color.White) },
                                        onClick = {
                                            gender = g
                                            showGenderMenu = false
                                        }
                                    )
                                }
                            }
                        }
                    }

                    Column(modifier = Modifier.weight(1.5f)) {
                        Text("Contact Number *", fontSize = 12.sp, color = MutedText)
                        OutlinedTextField(
                            value = phone,
                            onValueChange = { phone = it },
                            placeholder = { Text("+1 (555) 019-2834", color = MutedText, fontSize = 14.sp) },
                            modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
                            colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = SanctusIndigo, unfocusedBorderColor = MaterialTheme.colorScheme.secondary)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Email
                Text("Email Address", fontSize = 12.sp, color = MutedText)
                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    placeholder = { Text("john@example.com", color = MutedText, fontSize = 14.sp) },
                    modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
                    colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = SanctusIndigo, unfocusedBorderColor = MaterialTheme.colorScheme.secondary)
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Address
                Text("Home Address", fontSize = 12.sp, color = MutedText)
                OutlinedTextField(
                    value = address,
                    onValueChange = { address = it },
                    placeholder = { Text("123 Grace Street", color = MutedText, fontSize = 14.sp) },
                    modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
                    colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = SanctusIndigo, unfocusedBorderColor = MaterialTheme.colorScheme.secondary)
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Location & Baptism
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Location/District *", fontSize = 12.sp, color = MutedText)
                        OutlinedTextField(
                            value = location,
                            onValueChange = { location = it },
                            placeholder = { Text("North District", color = MutedText, fontSize = 14.sp) },
                            modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
                            colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = SanctusIndigo, unfocusedBorderColor = MaterialTheme.colorScheme.secondary)
                        )
                    }

                    Column(modifier = Modifier.weight(1f)) {
                        Text("Baptism Status *", fontSize = 12.sp, color = MutedText)
                        Box(modifier = Modifier.fillMaxWidth().padding(top = 4.dp)) {
                            Surface(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .border(1.dp, MaterialTheme.colorScheme.secondary, RoundedCornerShape(8.dp))
                                    .clickable { showBaptismMenu = true },
                                color = MaterialTheme.colorScheme.surface,
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 14.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(baptismStatus, fontSize = 14.sp, color = Color.White)
                                    Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = MutedText)
                                }
                            }
                            DropdownMenu(
                                expanded = showBaptismMenu,
                                onDismissRequest = { showBaptismMenu = false },
                                modifier = Modifier.background(MaterialTheme.colorScheme.surface)
                            ) {
                                listOf("Baptized", "Non-Baptized").forEach { b ->
                                    DropdownMenuItem(
                                        text = { Text(b, color = Color.White) },
                                        onClick = {
                                            baptismStatus = b
                                            showBaptismMenu = false
                                        }
                                    )
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Religion of Origin & Date Joined
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Religion of Origin", fontSize = 12.sp, color = MutedText)
                        OutlinedTextField(
                            value = religion,
                            onValueChange = { religion = it },
                            placeholder = { Text("e.g. Baptist", color = MutedText, fontSize = 14.sp) },
                            modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
                            colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = SanctusIndigo, unfocusedBorderColor = MaterialTheme.colorScheme.secondary)
                        )
                    }

                    Column(modifier = Modifier.weight(1f)) {
                        Text("Date of Joining *", fontSize = 12.sp, color = MutedText)
                        OutlinedTextField(
                            value = dateJoined,
                            onValueChange = { dateJoined = it },
                            placeholder = { Text("yyyy-MM-dd", color = MutedText, fontSize = 14.sp) },
                            modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
                            colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = SanctusIndigo, unfocusedBorderColor = MaterialTheme.colorScheme.secondary)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Family Association
                Text("Family Association", fontSize = 12.sp, color = MutedText)
                Box(modifier = Modifier.fillMaxWidth().padding(top = 4.dp)) {
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(1.dp, MaterialTheme.colorScheme.secondary, RoundedCornerShape(8.dp))
                            .clickable { showFamilyMenu = true },
                        color = MaterialTheme.colorScheme.surface,
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 14.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            val activeFamilyName = if (familyId.isEmpty()) "No Family (Individual Member)" else families.find { it.id == familyId }?.name ?: "No Family"
                            Text(activeFamilyName, fontSize = 14.sp, color = Color.White)
                            Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = MutedText)
                        }
                    }
                    DropdownMenu(
                        expanded = showFamilyMenu,
                        onDismissRequest = { showFamilyMenu = false },
                        modifier = Modifier.background(MaterialTheme.colorScheme.surface)
                    ) {
                        DropdownMenuItem(
                            text = { Text("No Family (Individual Member)", color = Color.White) },
                            onClick = {
                                familyId = ""
                                showFamilyMenu = false
                            }
                        )
                        families.forEach { fam ->
                            DropdownMenuItem(
                                text = { Text(fam.name, color = Color.White) },
                                onClick = {
                                    familyId = fam.id
                                    showFamilyMenu = false
                                }
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // If Family selected -> show Role selection. If NO family -> show Pastor assignment selection
                if (familyId.isNotEmpty()) {
                    Text("Family Role/Relation", fontSize = 12.sp, color = MutedText)
                    Box(modifier = Modifier.fillMaxWidth().padding(top = 4.dp)) {
                        Surface(
                            modifier = Modifier
                                .fillMaxWidth()
                                .border(1.dp, MaterialTheme.colorScheme.secondary, RoundedCornerShape(8.dp))
                                .clickable { showRoleMenu = true },
                            color = MaterialTheme.colorScheme.surface,
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 14.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(role, fontSize = 14.sp, color = Color.White)
                                Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = MutedText)
                            }
                        }
                        DropdownMenu(
                            expanded = showRoleMenu,
                            onDismissRequest = { showRoleMenu = false },
                            modifier = Modifier.background(MaterialTheme.colorScheme.surface)
                        ) {
                            listOf("Father", "Mother", "Son", "Daughter", "Grandparent", "Other").forEach { r ->
                                DropdownMenuItem(
                                    text = { Text(r, color = Color.White) },
                                    onClick = {
                                        role = r
                                        showRoleMenu = false
                                    }
                                )
                            }
                        }
                    }
                } else {
                    Text("Assigned Assistant Pastor *", fontSize = 12.sp, color = MutedText)
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
                                val activePastorName = pastors.find { it.id == pastorId }?.name ?: "Select Pastor"
                                Text(activePastorName, fontSize = 14.sp, color = Color.White)
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
                                        pastorId = pastor.id
                                        showPastorMenu = false
                                    }
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Prayer requests
                Text("Prayer Matters / Requests", fontSize = 12.sp, color = MutedText)
                OutlinedTextField(
                    value = prayerRequests,
                    onValueChange = { prayerRequests = it },
                    placeholder = { Text("List prayer topics, counseling requests...", color = MutedText, fontSize = 14.sp) },
                    modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
                    colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = SanctusIndigo, unfocusedBorderColor = MaterialTheme.colorScheme.secondary),
                    minLines = 2
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
                            if (name.isNotEmpty() && phone.isNotEmpty()) {
                                onConfirm(
                                    name, gender, email, phone, address, location, dateJoined,
                                    religion, baptismStatus, familyId, if (familyId.isNotEmpty()) role else "",
                                    pastorId, prayerRequests
                                )
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = SanctusIndigo),
                        enabled = name.isNotEmpty() && phone.isNotEmpty()
                    ) {
                        Text("Add Believer")
                    }
                }
            }
        }
    }
}
