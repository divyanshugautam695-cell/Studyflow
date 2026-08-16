package com.studyflow.app

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        openStudyFlow()
    }

    private fun openStudyFlow() {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://studyflow-gamma-bice.vercel.app/"))
        startActivity(intent)
        finish()
    }
}
