package com.example.sanctusmobile.data

import kotlinx.serialization.Serializable

@Serializable
data class Pastor(
    val id: String,
    val name: String,
    val district: String,
    val avatar: String
)

@Serializable
data class Family(
    val id: String,
    val name: String,
    val pastorId: String,
    val location: String
)

@Serializable
data class Believer(
    val id: String,
    val name: String,
    val gender: String,
    val email: String,
    val phone: String,
    val address: String,
    val location: String,
    val dateJoined: String,
    val religion: String,
    val baptismStatus: String,
    val familyId: String,
    val role: String,
    val pastorId: String,
    val prayerRequests: String,
    val studyCompleted: Boolean,
    val studyDate: String?,
    val growthRate: Int
)

@Serializable
data class Task(
    val id: String,
    val title: String,
    val desc: String,
    val pastorId: String,
    val urgency: String,
    val believerId: String,
    val status: String, // "pending", "in_progress", "completed"
    val dateCreated: String
)

@Serializable
data class StudyPlan(
    val id: String,
    val title: String,
    val scripture: String,
    val content: String,
    val action: String
)
