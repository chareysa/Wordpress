package org.wordpress.mobile.ReactNativeGutenbergBridge;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.os.Handler;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;

import androidx.annotation.Nullable;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import java.util.concurrent.atomic.AtomicBoolean;

public class GutenbergEmbedWebViewActivity extends AppCompatActivity {
    public static final String ARG_CONTENT = "content";
    public static final String ARG_TITLE = "title";
    private static final String JAVA_SCRIPT_INTERFACE_NAME = "wpwebkit";

    protected WebView mWebView;

    private ProgressBar mProgressBar;
    private AtomicBoolean mIsWebPageLoaded = new AtomicBoolean(false);
    private final Handler mWebPageLoadedHandler = new Handler();
    private final Runnable mWebPageLoadedRunnable = new Runnable() {
        @Override public void run() {
            if (!mIsWebPageLoaded.getAndSet(true)) {
                mProgressBar.setVisibility(View.GONE);
            }
        }
    };


    @SuppressLint("SetJavaScriptEnabled")
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_gutenberg_embed_web_view);

        setupToolbar();

        mWebView = findViewById(R.id.embed_web_view);

        mProgressBar = findViewById(R.id.progress_bar);

        // Set settings
        WebSettings settings = mWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptThirdPartyCookies(mWebView, true);

        // Setup WebView client
        setupWebViewClient();

        // Setup Web Chrome client
        mWebView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int progress) {
                if (progress == 100) {
                    mWebPageLoadedHandler.removeCallbacks(mWebPageLoadedRunnable);
                    mWebPageLoadedHandler.postDelayed(mWebPageLoadedRunnable, 1500);
                } else {
                    mIsWebPageLoaded.compareAndSet(true, false);
                    if (mProgressBar.getVisibility() == View.GONE) {
                        mProgressBar.setVisibility(View.VISIBLE);
                    }
                    mProgressBar.setProgress(progress);
                }
            }
        });

        load();
    }

    protected void load() {
        mWebView.loadUrl("https://wordpress.org/gutenberg/");
    }

    private void setupToolbar() {
        setTitle("");

        Toolbar toolbar = findViewById(R.id.toolbar);
        if (toolbar != null) {
            setSupportActionBar(toolbar);

            ActionBar actionBar = getSupportActionBar();
            if (actionBar != null) {
                actionBar.setDisplayShowTitleEnabled(true);
                actionBar.setDisplayHomeAsUpEnabled(true);
                actionBar.setHomeAsUpIndicator(R.drawable.ic_close_24px);
                actionBar.setSubtitle("");
                actionBar.setTitle(getToolbarTitle());
            }
        }
    }

    protected String getToolbarTitle() {
        return "";
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        super.onCreateOptionsMenu(menu);

        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.menu_gutenberg_embed_webview, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(final MenuItem item) {
        if (mWebView == null) {
            return false;
        }

        int itemID = item.getItemId();

        if (itemID == android.R.id.home) {
            finish();
        }

        return super.onOptionsItemSelected(item);
    }

    private void setupWebViewClient() {
        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                // Center the embed with a black background;
                // @TODO should this use the preferred color scheme?
                String css = "body{margin:0;background:#000;display:flex;align-items:center;}";
                String js = String.format("(()=>{const c='%s';const s=document.createElement('style');s.textContent=c;document.head.append(s);})()", css);
                view.evaluateJavascript(js,null);
                super.onPageStarted(view, url, favicon);
            }
        });
    }

    @Override
    public void onBackPressed() {
        if (mWebView.canGoBack()) {
            mWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public void finish() {
        runOnUiThread(() -> {
            mWebView.removeJavascriptInterface(JAVA_SCRIPT_INTERFACE_NAME); // not sure we need this;
            mWebView.clearHistory();
            mWebView.clearFormData();
            mWebView.clearCache(true);
            mWebView.clearSslPreferences();
        });

        super.finish();
    }

    @Override
    protected void onDestroy() {
        mWebPageLoadedHandler.removeCallbacks(mWebPageLoadedRunnable); // Not sure we add any callbacks, might not need this
        super.onDestroy();
    }
}
