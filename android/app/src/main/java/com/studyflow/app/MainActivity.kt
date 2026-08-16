package com.studyflow.app

import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.os.Bundle
import android.util.Base64
import android.view.Gravity
import android.view.View
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
        private val NAVY = Color.rgb(16, 42, 67)
        private val BLUE = Color.rgb(23, 105, 224)
        private val BG = Color.rgb(245, 247, 250)
        private val TEXT = Color.rgb(23, 32, 42)
        private val MUTED = Color.rgb(100, 116, 139)
        private val BORDER = Color.rgb(229, 231, 235)
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
            .putString(TOKEN, token).putString(EMAIL, email).apply()
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
            setBackgroundColor(BG)
        }
        setContentView(root)
    }

    private fun showLogin() {
        baseLayout()
        val scroll = ScrollView(this)
        val page = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER_HORIZONTAL
            setPadding(dp(20), dp(28), dp(20), dp(28))
        }
        scroll.addView(page)
        root.addView(scroll, LinearLayout.LayoutParams(-1, -1))

        // Matches the website's StudyFlow brand mark: navy rounded tile + graduation cap.
        val brand = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL; gravity = Gravity.CENTER_VERTICAL }
        brand.addView(iconTile(48), LinearLayout.LayoutParams(dp(48), dp(48)))
        brand.addView(label("StudyFlow", 21f, TEXT, true).apply { setPadding(dp(12), 0, 0, 0) })
        page.addView(brand, LinearLayout.LayoutParams(-1, -2).apply { bottomMargin = dp(48) })

        val card = card()
        page.addView(card, LinearLayout.LayoutParams(-1, -2))
        card.addView(label("Welcome back", 28f, TEXT, true))
        card.addView(label("Sign in to keep your learning progress synced.", 14f, MUTED, false).apply { setPadding(0, dp(7), 0, dp(24)) })

        val google = outlineButton("Continue with Google")
        google.setOnClickListener { startGoogleLogin() }
        card.addView(google, LinearLayout.LayoutParams(-1, dp(50)).apply { bottomMargin = dp(10) })

        val email = outlineButton("Send secure email sign-in link")
        email.setOnClickListener { Toast.makeText(this, "Use the secure email sign-in on the StudyFlow website.", Toast.LENGTH_SHORT).show() }
        card.addView(email, LinearLayout.LayoutParams(-1, dp(50)))

        val divider = label("OR", 11f, Color.rgb(148, 163, 184), true).apply {
            gravity = Gravity.CENTER
            setPadding(0, dp(18), 0, dp(18))
        }
        card.addView(divider)
        card.addView(label("Your learning workspace", 17f, TEXT, true))
        card.addView(label("Chapter-wise practice, progress tracking and personalized preparation for NCERT, JEE and NEET.", 13f, MUTED, false).apply { setPadding(0, dp(7), 0, 0) })

        val secure = label("✓  Secure authentication powered by Supabase", 12f, Color.rgb(71, 85, 105), false).apply {
            setPadding(0, dp(24), 0, 0)
        }
        card.addView(secure)
    }

    private fun startGoogleLogin() {
        val uri = Uri.parse(SUPABASE_AUTH).buildUpon()
            .appendQueryParameter("provider", "google")
            .appendQueryParameter("redirect_to", REDIRECT_URI)
            .build()
        try { startActivity(Intent(Intent.ACTION_VIEW, uri)) }
        catch (_: Exception) { Toast.makeText(this, "No browser available for Google sign-in", Toast.LENGTH_LONG).show() }
    }

    private fun showDashboard() {
        baseLayout()
        val header = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(dp(20), dp(18), dp(20), dp(14))
            setBackgroundColor(Color.WHITE)
        }
        header.addView(iconTile(42), LinearLayout.LayoutParams(dp(42), dp(42)))
        header.addView(label("StudyFlow", 20f, TEXT, true).apply { setPadding(dp(10), 0, 0, 0) }, LinearLayout.LayoutParams(0, -2, 1f))
        val profile = label("Student", 12f, MUTED, true).apply { gravity = Gravity.CENTER }
        header.addView(profile, LinearLayout.LayoutParams(dp(72), dp(36)))
        root.addView(header)

        val scroll = ScrollView(this)
        val content = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; setPadding(dp(20), dp(20), dp(20), dp(28)) }
        scroll.addView(content)
        root.addView(scroll, LinearLayout.LayoutParams(-1, 0, 1f))

        val email = getSharedPreferences(PREFS, MODE_PRIVATE).getString(EMAIL, "Student") ?: "Student"
        val name = email.substringBefore("@").ifBlank { "Student" }
        content.addView(label("Good to see you, $name 👋", 27f, TEXT, true))
        content.addView(label("Let's make today's study session count.", 14f, MUTED, false).apply { setPadding(0, dp(5), 0, dp(22)) })

        val hero = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(20), dp(20), dp(20), dp(20))
            background = gradient(NAVY, Color.rgb(23, 74, 126), Color.rgb(23, 105, 224), 22f)
        }
        hero.addView(label("TODAY'S FOCUS", 11f, Color.rgb(191, 219, 254), true))
        hero.addView(label("Build a consistent study streak", 21f, Color.WHITE, true).apply { setPadding(0, dp(8), 0, dp(5)) })
        hero.addView(label("Practice important topics and keep your progress moving.", 13f, Color.rgb(219, 234, 254), false))
        val start = whiteButton("Start studying")
        start.setOnClickListener { Toast.makeText(this, "Study session coming next.", Toast.LENGTH_SHORT).show() }
        hero.addView(start, LinearLayout.LayoutParams(-1, dp(46)).apply { topMargin = dp(16) })
        content.addView(hero, LinearLayout.LayoutParams(-1, -2).apply { bottomMargin = dp(18) })

        content.addView(label("Your workspace", 18f, TEXT, true).apply { setPadding(0, 0, 0, dp(12)) })
        content.addView(featureCard("Practice", "Test yourself and target weak topics", "Practice questions"))
        content.addView(featureCard("Mastery", "Track chapter and topic progress", "View topic mastery"))
        content.addView(featureCard("Mistakes", "Review questions you previously missed", "Review mistakes"))

        val logout = outlineButton("Sign out")
        logout.setOnClickListener { getSharedPreferences(PREFS, MODE_PRIVATE).edit().clear().apply(); showLogin() }
        content.addView(logout, LinearLayout.LayoutParams(-1, dp(48)).apply { topMargin = dp(8) })
    }

    private fun featureCard(title: String, subtitle: String, action: String): LinearLayout {
        val card = card().apply { setPadding(dp(17), dp(17), dp(17), dp(17)) }
        val row = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL; gravity = Gravity.CENTER_VERTICAL }
        val text = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        text.addView(label(title, 16f, TEXT, true))
        text.addView(label(subtitle, 12f, MUTED, false).apply { setPadding(0, dp(5), 0, 0) })
        row.addView(text, LinearLayout.LayoutParams(0, -2, 1f))
        val b = smallButton(action)
        b.setOnClickListener { Toast.makeText(this, "$action is available in the native StudyFlow app.", Toast.LENGTH_SHORT).show() }
        row.addView(b)
        card.addView(row)
        return card.apply { layoutParams = LinearLayout.LayoutParams(-1, -2).apply { bottomMargin = dp(10) } }
    }

    private fun iconTile(size: Int): View = TextView(this).apply {
        text = "⌁"
        gravity = Gravity.CENTER
        textSize = if (size > 44) 24f else 20f
        setTextColor(NAVY)
        background = rounded(Color.WHITE, 12f)
        // A simple cap-like mark avoids emoji rendering differences across Android devices.
        text = "🎓"
    }

    private fun card(): LinearLayout = LinearLayout(this).apply {
        orientation = LinearLayout.VERTICAL
        setPadding(dp(22), dp(22), dp(22), dp(22))
        background = rounded(Color.WHITE, 22f)
        elevation = dp(3).toFloat()
    }

    private fun outlineButton(text: String): Button = Button(this).apply {
        this.text = text; textSize = 13f; isAllCaps = false; setTextColor(Color.rgb(51, 65, 85));
        background = rounded(Color.WHITE, 12f, BORDER)
        stateListAnimator = null
    }

    private fun smallButton(text: String): Button = Button(this).apply {
        this.text = text; textSize = 11f; isAllCaps = false; setTextColor(BLUE); background = rounded(Color.rgb(239, 246, 255), 10f); stateListAnimator = null
    }

    private fun whiteButton(text: String): Button = Button(this).apply {
        this.text = text; textSize = 13f; isAllCaps = false; setTextColor(NAVY); background = rounded(Color.WHITE, 12f); stateListAnimator = null
    }

    private fun label(text: String, size: Float, color: Int, bold: Boolean): TextView = TextView(this).apply {
        this.text = text; textSize = size; setTextColor(color); if (bold) setTypeface(typeface, android.graphics.Typeface.BOLD)
    }

    private fun rounded(fill: Int, radius: Float, stroke: Int? = null): GradientDrawable = GradientDrawable().apply {
        setColor(fill); cornerRadius = dp(radius.toInt()).toFloat(); if (stroke != null) setStroke(dp(1), stroke)
    }

    private fun gradient(a: Int, b: Int, c: Int, radius: Float): GradientDrawable = GradientDrawable(GradientDrawable.Orientation.TL_BR, intArrayOf(a, b, c)).apply { cornerRadius = dp(radius.toInt()).toFloat() }

    private fun dp(value: Int): Int = (value * resources.displayMetrics.density).toInt()
}
