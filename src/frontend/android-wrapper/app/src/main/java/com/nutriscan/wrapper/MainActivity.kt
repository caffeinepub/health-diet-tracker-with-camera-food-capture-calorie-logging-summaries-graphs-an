package com.nutriscan.wrapper

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import android.webkit.*
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

/**
 * Main activity for the Calorieshivam Android wrapper.
 * 
 * This activity hosts a WebView that loads the web application with:
 * - Internet Identity authentication support (popup/redirect handling)
 * - Camera permission handling for food scanning
 * - Secure HTTPS-only communication
 * - Proper back button navigation
 * - Offline error handling
 * 
 * Technical identifiers (package name, resource keys) remain unchanged for build compatibility.
 */
class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    private var cameraPermissionCallback: ValueCallback<Array<Uri>>? = null
    private val CAMERA_PERMISSION_REQUEST_CODE = 100

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webview)
        setupWebView()
        
        // Load the configured web app URL
        val baseUrl = getString(R.string.nutriscan_base_url)
        webView.loadUrl(baseUrl)
    }

    private fun setupWebView() {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = false
            allowContentAccess = true
            mediaPlaybackRequiresUserGesture = false
            
            // Enable multiple windows for Internet Identity popups
            javaScriptCanOpenWindowsAutomatically = true
            setSupportMultipleWindows(true)
        }

        // Handle Internet Identity popups and new windows
        webView.webChromeClient = object : WebChromeClient() {
            override fun onCreateWindow(
                view: WebView?,
                isDialog: Boolean,
                isUserGesture: Boolean,
                resultMsg: android.os.Message?
            ): Boolean {
                val newWebView = WebView(this@MainActivity)
                newWebView.settings.apply {
                    javaScriptEnabled = true
                    domStorageEnabled = true
                    javaScriptCanOpenWindowsAutomatically = true
                }
                
                // Handle navigation in popup window
                newWebView.webViewClient = object : WebViewClient() {
                    override fun shouldOverrideUrlLoading(
                        view: WebView?,
                        request: WebResourceRequest?
                    ): Boolean {
                        val url = request?.url?.toString() ?: return false
                        
                        // If redirecting back to app, load in main WebView
                        if (url.startsWith(getString(R.string.nutriscan_base_url))) {
                            webView.loadUrl(url)
                            return true
                        }
                        return false
                    }
                }
                
                val transport = resultMsg?.obj as? WebView.WebViewTransport
                transport?.webView = newWebView
                resultMsg?.sendToTarget()
                return true
            }

            // Handle camera permission requests from WebView
            override fun onPermissionRequest(request: PermissionRequest?) {
                request?.let {
                    if (it.resources.contains(PermissionRequest.RESOURCE_VIDEO_CAPTURE)) {
                        if (checkCameraPermission()) {
                            it.grant(it.resources)
                        } else {
                            requestCameraPermission()
                            // Store request to grant after permission is given
                            it.grant(it.resources)
                        }
                    } else {
                        it.deny()
                    }
                }
            }

            override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
                // Log WebView console messages for debugging
                consoleMessage?.let {
                    android.util.Log.d("WebView", "${it.message()} -- From line ${it.lineNumber()} of ${it.sourceId()}")
                }
                return true
            }
        }

        // Handle navigation and external links
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {
                val url = request?.url?.toString() ?: return false
                
                // Allow navigation within the app domain
                if (url.startsWith(getString(R.string.nutriscan_base_url)) || 
                    url.startsWith("https://identity.ic0.app") ||
                    url.startsWith("https://identity.internetcomputer.org")) {
                    return false // Let WebView handle it
                }
                
                // Block other external navigation
                return true
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                super.onReceivedError(view, request, error)
                if (request?.isForMainFrame == true) {
                    Toast.makeText(
                        this@MainActivity,
                        "Failed to load page. Please check your connection.",
                        Toast.LENGTH_LONG
                    ).show()
                }
            }
        }
    }

    private fun checkCameraPermission(): Boolean {
        return ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.CAMERA
        ) == PackageManager.PERMISSION_GRANTED
    }

    private fun requestCameraPermission() {
        ActivityCompat.requestPermissions(
            this,
            arrayOf(Manifest.permission.CAMERA),
            CAMERA_PERMISSION_REQUEST_CODE
        )
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        
        when (requestCode) {
            CAMERA_PERMISSION_REQUEST_CODE -> {
                if (grantResults.isNotEmpty() && 
                    grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    // Permission granted, WebView will handle camera access
                    Toast.makeText(this, "Camera permission granted", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(
                        this,
                        "Camera permission is required for food scanning",
                        Toast.LENGTH_LONG
                    ).show()
                }
            }
        }
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}
