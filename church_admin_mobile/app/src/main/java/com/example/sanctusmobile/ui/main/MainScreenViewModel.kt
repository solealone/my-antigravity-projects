package com.example.sanctusmobile.ui.main

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.sanctusmobile.data.DataRepository
import com.example.sanctusmobile.data.Pastor
import com.example.sanctusmobile.data.Family
import com.example.sanctusmobile.data.Believer
import com.example.sanctusmobile.data.Task
import com.example.sanctusmobile.data.StudyPlan
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.combine

enum class SanctusTab {
    Dashboard, Directory, Pastors, BibleStudy, Attendance
}

class MainScreenViewModel(private val repository: DataRepository) : ViewModel() {
    
    private val _currentTab = MutableStateFlow(SanctusTab.Dashboard)
    val currentTab: StateFlow<SanctusTab> = _currentTab.asStateFlow()

    val pastors = repository.pastors
    val families = repository.families
    val believers = repository.believers
    val tasks = repository.tasks
    val currentStudyPlan = repository.currentStudyPlan
    val attendance = repository.attendance

    // Combined UI State if needed, but exposing directly is cleaner for Compose recomposition
    fun selectTab(tab: SanctusTab) {
        _currentTab.value = tab
    }

    fun addFamily(name: String, pastorId: String, location: String) {
        repository.addFamily(name, pastorId, location)
    }

    fun addBeliever(
        name: String, gender: String, email: String, phone: String,
        address: String, location: String, dateJoined: String,
        religion: String, baptismStatus: String, familyId: String,
        role: String, pastorId: String, prayerRequests: String
    ) {
        repository.addBeliever(
            name, gender, email, phone, address, location, dateJoined,
            religion, baptismStatus, familyId, role, pastorId, prayerRequests
        )
    }

    fun assignTask(title: String, desc: String, pastorId: String, urgency: String, believerId: String) {
        repository.assignTask(title, desc, pastorId, urgency, believerId)
    }

    fun toggleTaskStatus(taskId: String) {
        repository.toggleTaskStatus(taskId)
    }

    fun deleteTask(taskId: String) {
        repository.deleteTask(taskId)
    }

    fun toggleStudyCompletion(believerId: String) {
        repository.toggleStudyCompletion(believerId)
    }

    fun publishStudyPlan(title: String, scripture: String, content: String, action: String) {
        repository.publishStudyPlan(title, scripture, content, action)
    }

    fun toggleAttendance(date: String, believerId: String) {
        repository.toggleAttendance(date, believerId)
    }
}
