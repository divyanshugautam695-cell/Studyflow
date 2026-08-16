package com.studyflow.app

import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.util.Base64
import android.view.Gravity
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast
import org.json.JSONObject

class MainActivity : Activity() {
    companion object {
        private const val SUPABASE_AUTH = "https://sjnjhcfplohuiljjeyjp.supabase.co/auth/v1/authorize"
        private const val REDIRECT_URI = "studyflow://auth-callback"
        private const val PREFS = "studyflow_session"
        private const val TOKEN = "access_token"
        private const val EMAIL = "email"
    }

    private lateinit var root: LinearLayout

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        handleAuthCallback(intent)
        showStartScreen()
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        if (handleAuthCallback(intent)) showDashboard()
    }

    private fun handleAuthCallback(intent: Intent): Boolean {
        val data = intent.data ?: return false
        if (data.scheme != "studyflow") return false
        val fragment = data.fragment ?: return false
        val values = fragment.split("&").mapNotNull {
            val p = it.split("=", limit = 2)
            if (p.size == 2) p[0] to Uri.decode(p[1]) else null
        }.toMap()
        val token = values[TOKEN] ?: return false
        val email = jwtEmail(token) ?: "Student"
        getSharedPreferences(PREFS, MODE_PRIVATE).edit()
            .putString(TOKEN, token)
            .putString(EMAIL, email)
            .apply()
        return true
    }

    private fun jwtEmail(token: String): String? = try {
        val payload = token.split(".")[1]
        val decoded = Base64.decode(payload, Base64.URL_SAFE or Base64.NO_WRAP or Base64.NO_PADDING)
        JSONObject(String(decoded, Charsets.UTF_8)).optString("email", null)
    } catch (_: Exception) { null }

    private fun showStartScreen() {
        if (getSharedPreferences(PREFS, MODE_PRIVATE).getString(TOKEN, null) != null) showDashboard() else showLogin()
    }

    private fun baseLayout() {
        root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(24), dp(22), dp(24), dp(24))
            setBackgroundColor(Color.rgb(248, 250, 252))
        }
        setContentView(root)
    }

    private fun showLogin() {
        baseLayout()
        val scroll = ScrollView(this)
        val box = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER_HORIZONTAL
            setPadding(0, dp(48), 0, dp(24))
        }
        scroll.addView(box)
        root.addView(scroll, LinearLayout.LayoutParams(-1, -1))

        val icon = TextView(this).apply {
            text = "🎓"
            textSize = 38f
            gravity = Gravity.CENTER
            setTextColor(Color.WHITE)
            setBackgroundColor(Color.rgb(15, 39, 64))
        }
        box.addView(icon, LinearLayout.LayoutParams(dp(72), dp(72)).apply { bottomMargin = dp(20) })
        box.addView(label("StudyFlow", 28f, Color.rgb(15, 23, 42)))
        box.addView(label("Your personal study companion", 15f, Color.rgb(100, 116, 139)))

        val card = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(22), dp(24), dp(22), dp(24))
            setBackgroundColor(Color.WHITE)
        }
        box.addView(card, LinearLayout.LayoutParams(-1, -2).apply { topMargin = dp(34) })
        card.addView(label("Welcome back", 24f, Color.rgb(15, 23, 42)))
        card.addView(label("Sign in to keep your learning progress synced.", 14f, Color.rgb(100, 116, 139)))

        val google = button("Continue with Google")
        google.setOnClickListener { startGoogleLogin() }
        card.addView(google, LinearLayout.LayoutParams(-1, dp(52)).apply { topMargin = dp(24) })
        card.addView(label("Secure sign-in", 13f, Color.rgb(71, 85, 105)).apply {
            gravity = Gravity.CENTER
            setPadding(0, dp(18), 0, dp(8))
        })
        card.addView(label("Google authentication opens briefly for authorization and then returns directly to the StudyFlow app.", 13f, Color.rgb(100, 116, 139)))
    }

    private fun startGoogleLogin() {
        val uri = Uri.parse(SUPABASE_AUTH).buildUpon()
            .appendQueryParameter("provider", "google")
            .appendQueryParameter("redirect_to", REDIRECT_URI)
            .build()
        try {
            startActivity(Intent(Intent.ACTION_VIEW, uri))
        } catch (_: Exception) {
            Toast.makeText(this, "No browser available for Google sign-in", Toast.LENGTH_LONG).show()
        }
    }

    private fun showDashboard() {
        baseLayout()
        val scroll = ScrollView(this)
        val content = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        scroll.addView(content)
        root.addView(scroll, LinearLayout.LayoutParams(-1, 0, 1f))

        val email = getSharedPreferences(PREFS, MODE_PRIVATE).getString(EMAIL, "Student") ?: "Student"
        content.addView(label("StudyFlow", 30f, Color.rgb(15, 23, 42)))
        content.addView(label("Good to see you, ${email.substringBefore("@")} 👋", 16f, Color.rgb(71, 85, 105)).apply {
            setPadding(0, dp(4), 0, dp(22))
        })
        content.addView(statCard("📚  Today's focus", "Build a consistent study streak", "Start a study session"))
        content.addView(statCard("🎯  Practice", "Test yourself and track weak topics", "Practice questions"))
        content.addView(statCard("🧠  Mastery", "Review your topic progress", "View topic mastery"))
        content.addView(statCard("⚠️  Mistakes", "Review questions you previously missed", "Review mistakes"))

        val logout = button("Sign out")
        logout.setOnClickListener {
            getSharedPreferences(PREFS, MODE_PRIVATE).edit().clear().apply()
            showLogin()
        }
        content.addView(logout, LinearLayout.LayoutParams(-1, dp(50)).apply { topMargin = dp(18) })

        val website = button("Open StudyFlow website")
        website.setOnClickListener { startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://studyflow-gamma-bice.vercel.app/"))) }
        content.addView(website, LinearLayout.LayoutParams(-1, dp(50)).apply { topMargin = dp(10) })
    }

    private fun statCard(title: String, subtitle: String, action: String): LinearLayout {
        val card = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(18), dp(18), dp(18), dp(18))
            setBackgroundColor(Color.WHITE)
        }
        card.addView(label(title, 18f, Color.rgb(15, 23, 42)))
        card.addView(label(subtitle, 13f, Color.rgb(100, 116, 139)).apply { setPadding(0, dp(6), 0, dp(12)) })
        val b = button(action)
        b.setOnClickListener { Toast.makeText(this, "$action is available in the native StudyFlow app.", Toast.LENGTH_SHORT).show() }
        card.addView(b, LinearLayout.LayoutParams(-1, dp(44)))
        return card.apply { layoutParams = LinearLayout.LayoutParams(-1, -2).apply { bottomMargin = dp(12) } }
    }

    private fun label(text: String, size: Float, color: Int): TextView = TextView(this).apply {
        this.text = text
        textSize = size
        setTextColor(color)
    }

    private fun button(text: String): Button = Button(this).apply {
        this.text = text
        textSize = 14f
        isAllCaps = false
        setTextColor(Color.WHITE)
        setBackgroundColor(Color.rgb(24, 88, 166))
    }

    private fun dp(value: Int): Int = (value * resources.displayMetrics.density).toInt()
}
