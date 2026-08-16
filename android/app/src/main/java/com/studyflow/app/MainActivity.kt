package com.studyflow.app

import android.app.Activity
import android.net.Uri
import android.os.Bundle
import androidx.browser.customtabs.CustomTabsIntent

class MainActivity : Activity() {
    companion object {
        private const val STUDYFLOW_URL = "https://studyflow-gamma-bice.vercel.app/"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        openStudyFlow()
    }

    private fun openStudyFlow() {
        val customTabsIntent = CustomTabsIntent.Builder()
            .setShowTitle(true)
            .build()

        customTabsIntent.launchUrl(this, Uri.parse(STUDYFLOW_URL))
        finish()
    }
}
