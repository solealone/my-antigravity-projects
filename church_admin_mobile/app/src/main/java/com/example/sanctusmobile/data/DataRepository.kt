package com.example.sanctusmobile.data

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

interface DataRepository {
    val pastors: StateFlow<List<Pastor>>
    val families: StateFlow<List<Family>>
    val believers: StateFlow<List<Believer>>
    val tasks: StateFlow<List<Task>>
    val currentStudyPlan: StateFlow<StudyPlan?>
    val attendance: StateFlow<Map<String, Map<String, Boolean>>> // date -> (believerId -> present)

    fun addFamily(name: String, pastorId: String, location: String)
    
    fun addBeliever(
        name: String, gender: String, email: String, phone: String,
        address: String, location: String, dateJoined: String,
        religion: String, baptismStatus: String, familyId: String,
        role: String, pastorId: String, prayerRequests: String
    )
    
    fun assignTask(title: String, desc: String, pastorId: String, urgency: String, believerId: String)
    fun toggleTaskStatus(taskId: String)
    fun deleteTask(taskId: String)
    
    fun toggleStudyCompletion(believerId: String)
    fun publishStudyPlan(title: String, scripture: String, content: String, action: String)
    
    fun toggleAttendance(date: String, believerId: String)
}

class DefaultDataRepository : DataRepository {
    private val _pastors = MutableStateFlow<List<Pastor>>(emptyList())
    override val pastors: StateFlow<List<Pastor>> = _pastors.asStateFlow()

    private val _families = MutableStateFlow<List<Family>>(emptyList())
    override val families: StateFlow<List<Family>> = _families.asStateFlow()

    private val _believers = MutableStateFlow<List<Believer>>(emptyList())
    override val believers: StateFlow<List<Believer>> = _believers.asStateFlow()

    private val _tasks = MutableStateFlow<List<Task>>(emptyList())
    override val tasks: StateFlow<List<Task>> = _tasks.asStateFlow()

    private val _currentStudyPlan = MutableStateFlow<StudyPlan?>(null)
    override val currentStudyPlan: StateFlow<StudyPlan?> = _currentStudyPlan.asStateFlow()

    private val _attendance = MutableStateFlow<Map<String, Map<String, Boolean>>>(emptyMap())
    override val attendance: StateFlow<Map<String, Map<String, Boolean>>> = _attendance.asStateFlow()

    init {
        seedMockData()
    }

    private fun seedMockData() {
        _pastors.value = listOf(
            Pastor("p1", "Pastor Joseph", "North District", "PJ"),
            Pastor("p2", "Pastor Matthew", "East District", "PM"),
            Pastor("p3", "Pastor Luke", "South District", "PL")
        )

        _families.value = listOf(
            Family("f1", "Adams Family", "p1", "North District"),
            Family("f2", "Carter Family", "p2", "East District"),
            Family("f3", "Evans Family", "p3", "South District"),
            Family("f4", "Davis Family", "p2", "East District")
        )

        _believers.value = listOf(
            Believer("b1", "John Adams", "Male", "john.adams@example.com", "+1 (555) 101-2020", "45 Grace Way", "North District", "2024-01-15", "Baptist", "Baptized", "f1", "Father", "p1", "Family spiritual growth and peace.", true, "2026-06-08", 85),
            Believer("b2", "Mary Adams", "Female", "mary.adams@example.com", "+1 (555) 101-2021", "45 Grace Way", "North District", "2024-01-15", "Methodist", "Baptized", "f1", "Mother", "p1", "Wisdom in raising children in faith.", true, "2026-06-08", 90),
            Believer("b3", "David Adams", "Male", "david.adams@example.com", "+1 (555) 101-2022", "45 Grace Way", "North District", "2024-01-15", "Baptist", "Baptized", "f1", "Son", "p1", "Focus in high school studies.", false, null, 60),
            Believer("b4", "Sarah Adams", "Female", "sarah.adams@example.com", "+1 (555) 101-2023", "45 Grace Way", "North District", "2024-01-15", "Baptist", "Non-Baptized", "f1", "Daughter", "p1", "Preparing for water baptism.", false, null, 70),
            
            Believer("b5", "Robert Carter", "Male", "robert.c@example.com", "+1 (555) 202-3030", "12 Sanctuary Road", "East District", "2025-03-10", "None", "Baptized", "f2", "Father", "p2", "Job security and career guidance.", true, "2026-06-09", 75),
            Believer("b6", "Helen Carter", "Female", "helen.c@example.com", "+1 (555) 202-3031", "12 Sanctuary Road", "East District", "2025-03-10", "Lutheran", "Baptized", "f2", "Mother", "p2", "Recovery from chronic knee pain.", true, "2026-06-09", 80),
            Believer("b7", "Chloe Carter", "Female", "chloe.c@example.com", "+1 (555) 202-3032", "12 Sanctuary Road", "East District", "2025-04-12", "None", "Non-Baptized", "f2", "Daughter", "p2", "Spiritual guidance for college.", false, null, 40),
            
            Believer("b8", "James Davis", "Male", "james.d@example.com", "+1 (555) 404-5050", "39 Heaven St", "East District", "2024-11-20", "Anglican", "Baptized", "f4", "Father", "p2", "Wisdom for parenting teenagers.", true, "2026-06-08", 85),
            Believer("b9", "Patricia Davis", "Female", "patricia.d@example.com", "+1 (555) 404-5051", "39 Heaven St", "East District", "2024-11-20", "Anglican", "Baptized", "f4", "Mother", "p2", "Peace and health in the household.", true, "2026-06-08", 80),
            Believer("b10", "Michael Davis", "Male", "mike.d@example.com", "+1 (555) 404-5052", "39 Heaven St", "East District", "2024-11-20", "Anglican", "Non-Baptized", "f4", "Son", "p2", "Overcoming mental stress and anxiety.", false, null, 50),
            
            Believer("b11", "William Evans", "Male", "william.e@example.com", "+1 (555) 505-6060", "88 Covenant Way", "South District", "2025-08-14", "Presbyterian", "Baptized", "f3", "Father", "p3", "Guidance for leading local Bible group.", true, "2026-06-09", 95),
            Believer("b12", "Karen Evans", "Female", "karen.e@example.com", "+1 (555) 505-6061", "88 Covenant Way", "South District", "2025-08-14", "Baptist", "Baptized", "f3", "Mother", "p3", "Recovery for aging parents.", true, "2026-06-09", 90),
            Believer("b13", "Thomas Evans", "Male", "tom.e@example.com", "+1 (555) 505-6062", "88 Covenant Way", "South District", "2025-08-14", "Baptist", "Baptized", "f3", "Son", "p3", "Guidance in university choices.", false, null, 65),
            
            Believer("b14", "Elizabeth Baker", "Female", "liz.baker@example.com", "+1 (555) 303-4040", "78 Faith Blvd", "North District", "2026-05-01", "Catholic", "Non-Baptized", "", "", "p1", "Newcomer adjustment and finding community.", false, null, 50),
            Believer("b15", "Christopher King", "Male", "chris.k@example.com", "+1 (555) 909-8080", "11 Prophetical Lane", "South District", "2026-05-20", "Pentecostal", "Baptized", "", "", "p3", "Spiritual grounding and local volunteering.", true, "2026-06-09", 70)
        )

        _tasks.value = listOf(
            Task("t1", "Visit the Carter Family", "Check in on Helen Carter after her surgery and pray for recovery.", "p2", "Critical", "b6", "pending", "2026-06-07"),
            Task("t2", "Baptism Preparation Class", "Host baptism class for Sarah Adams and Elizabeth Baker.", "p1", "Urgent", "", "in_progress", "2026-06-05"),
            Task("t3", "Deliver Welcome Basket", "Deliver newcomer basket to Elizabeth Baker and run intake counseling.", "p1", "Standard", "b14", "completed", "2026-05-02"),
            Task("t4", "Counsel Michael Davis", "Discuss biblical strategies for managing academic stress.", "p2", "Standard", "b10", "pending", "2026-06-08")
        )

        _currentStudyPlan.value = StudyPlan(
            "sp1",
            "The Power of Grace",
            "Ephesians 2:8-9",
            "Grace is a free gift, not something earned. We are saved through faith, not works, so that no one can boast. Reflect on what it means to live in freedom rather than performing for approval.",
            "Write down 3 things you are thankful for that you did not earn, and pray a prayer of thanks."
        )

        _attendance.value = mapOf(
            "2026-06-07" to mapOf(
                "b1" to true, "b2" to true, "b3" to true, "b4" to false,
                "b5" to true, "b6" to true, "b7" to false,
                "b8" to true, "b9" to true, "b10" to false,
                "b11" to true, "b12" to true, "b13" to true,
                "b14" to true, "b15" to true
            ),
            "2026-05-31" to mapOf(
                "b1" to true, "b2" to true, "b3" to false, "b4" to false,
                "b5" to true, "b6" to true, "b7" to false,
                "b8" to true, "b9" to true, "b10" to false,
                "b11" to true, "b12" to true, "b13" to false,
                "b14" to true, "b15" to true
            )
        )
    }

    override fun addFamily(name: String, pastorId: String, location: String) {
        val newId = "f" + (families.value.size + 1)
        val newFamily = Family(newId, name, pastorId, location)
        _families.value = _families.value + newFamily
    }

    override fun addBeliever(
        name: String, gender: String, email: String, phone: String,
        address: String, location: String, dateJoined: String,
        religion: String, baptismStatus: String, familyId: String,
        role: String, pastorId: String, prayerRequests: String
    ) {
        val newId = "b" + (believers.value.size + 1)
        
        // If family is selected, inherit pastorId from family
        val finalPastorId = if (familyId.isNotEmpty()) {
            families.value.find { it.id == familyId }?.pastorId ?: pastorId
        } else {
            pastorId
        }

        val newBeliever = Believer(
            id = newId,
            name = name,
            gender = gender,
            email = email,
            phone = phone,
            address = address,
            location = location,
            dateJoined = dateJoined,
            religion = religion,
            baptismStatus = baptismStatus,
            familyId = familyId,
            role = role,
            pastorId = finalPastorId,
            prayerRequests = prayerRequests,
            studyCompleted = false,
            studyDate = null,
            growthRate = 50
        )
        _believers.value = _believers.value + newBeliever
    }

    override fun assignTask(
        title: String, desc: String, pastorId: String, urgency: String, believerId: String
    ) {
        val newId = "t" + (tasks.value.size + 1)
        val todayStr = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
        val newTask = Task(newId, title, desc, pastorId, urgency, believerId, "pending", todayStr)
        _tasks.value = _tasks.value + newTask
    }

    override fun toggleTaskStatus(taskId: String) {
        _tasks.value = _tasks.value.map { task ->
            if (task.id == taskId) {
                val nextStatus = when (task.status) {
                    "pending" -> "in_progress"
                    "in_progress" -> "completed"
                    else -> "pending"
                }
                task.copy(status = nextStatus)
            } else {
                task
            }
        }
    }

    override fun deleteTask(taskId: String) {
        _tasks.value = _tasks.value.filter { it.id != taskId }
    }

    override fun toggleStudyCompletion(believerId: String) {
        val todayStr = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
        _believers.value = _believers.value.map { believer ->
            if (believer.id == believerId) {
                val nextCompleted = !believer.studyCompleted
                val nextGrowth = if (nextCompleted) {
                    Math.min(100, believer.growthRate + 10)
                } else {
                    Math.max(0, believer.growthRate - 10)
                }
                believer.copy(
                    studyCompleted = nextCompleted,
                    studyDate = if (nextCompleted) todayStr else null,
                    growthRate = nextGrowth
                )
            } else {
                believer
            }
        }
    }

    override fun publishStudyPlan(title: String, scripture: String, content: String, action: String) {
        val newPlan = StudyPlan("sp" + (System.currentTimeMillis() / 1000), title, scripture, content, action)
        _currentStudyPlan.value = newPlan
        // Reset all believer completions for the new plan
        _believers.value = _believers.value.map { believer ->
            believer.copy(studyCompleted = false, studyDate = null)
        }
    }

    override fun toggleAttendance(date: String, believerId: String) {
        val currentMap = _attendance.value.toMutableMap()
        val dateMap = (currentMap[date] ?: emptyMap()).toMutableMap()
        
        val isPresent = dateMap[believerId] == true
        dateMap[believerId] = !isPresent
        
        currentMap[date] = dateMap
        _attendance.value = currentMap
    }
}
