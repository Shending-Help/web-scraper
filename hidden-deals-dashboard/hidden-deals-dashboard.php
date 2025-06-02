<?php
/**
 * Plugin Name: Hidden Deals Dashboard
 * Description: Displays a React-based dashboard for hidden property deals in the WP admin.
 * Version: 1.0.0
 * Author: Your Name
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

// 1. Add Admin Menu Item
function hdd_add_admin_menu() {
    add_menu_page(
        'Hidden Deals',          
        'Hidden Deals',          
        'manage_options',       
        'hidden-deals-dashboard',
        'hdd_render_admin_page',
        'dashicons-star-filled', 
        20                       
    );
}
add_action( 'admin_menu', 'hdd_add_admin_menu' );

function hdd_render_admin_page() {
    ?>
    <div class="wrap">
        <div id="hidden-deals-react-app">
            <p>Loading React Dashboard...</p> 
            <!-- React will mount here -->
        </div>
    </div>
    <?php
}

function hdd_enqueue_react_app_assets( $hook_suffix ) {
    if ( 'toplevel_page_hidden-deals-dashboard' !== $hook_suffix ) {
        return;
    }

    $react_app_build_uri = plugin_dir_url( __FILE__ ) . 'react-app/build/';
    $react_app_build_path = plugin_dir_path( __FILE__ ) . 'react-app/build/';

    // One way to get hashed filenames (more robust)
    $asset_manifest_json = file_get_contents( $react_app_build_path . 'asset-manifest.json' );
    $asset_manifest = json_decode( $asset_manifest_json, true );
    
    $js_files = [];
    $css_files = [];

    if (isset($asset_manifest['files'])) {
        if (isset($asset_manifest['files']['main.js'])) {
            $js_files[] = $asset_manifest['files']['main.js'];
        }
        if (isset($asset_manifest['files']['main.css'])) {
            $css_files[] = $asset_manifest['files']['main.css'];
        }
        // Handle chunk files (runtime, vendor, etc.) if present
        foreach ($asset_manifest['files'] as $key => $file) {
            if (strpos($key, 'static/js/') === 0 && strpos($key, '.js.map') === false && $key !== 'main.js' && !in_array($file, $js_files)) {
                 if (isset($asset_manifest['entrypoints']) && in_array(basename($file), $asset_manifest['entrypoints']) ) {
                    // This is an entrypoint, already handled or will be
                 } else if (preg_match('/\.chunk\.js$/', $file) || preg_match('/runtime-main\.[a-f0-9]+\.js$/', $file)) {
                    $js_files[] = $file; // $file already includes static/js/
                 }
            }
             if (strpos($key, 'static/css/') === 0 && strpos($key, '.css.map') === false && $key !== 'main.css' && !in_array($file, $css_files)) {
                if (preg_match('/\.chunk\.css$/', $file)) {
                    $css_files[] = $file; // $file already includes static/css/
                }
            }
        }
    } else {
        error_log('Hidden Deals Dashboard: asset-manifest.json not found or "files" key missing.');
        return;
    }
    
    // Enqueue CSS files
    $css_dependency_handle = null;
    foreach ($css_files as $index => $css_file_path) {
        $handle = 'hdd-react-app-style-' . $index;
        wp_enqueue_style(
            $handle,
            $react_app_build_uri . ltrim($css_file_path, '/'), // ltrim in case path from manifest starts with /
            $css_dependency_handle ? array($css_dependency_handle) : array(),
            filemtime( $react_app_build_path . ltrim($css_file_path, '/') ) // Versioning based on file modification time
        );
        $css_dependency_handle = $handle; // Chain dependencies
    }


    $js_entrypoints = isset($asset_manifest['entrypoints']) ? $asset_manifest['entrypoints'] : [];
    $script_handles = [];

    if (!empty($js_entrypoints)) {
        foreach ($js_entrypoints as $entry_file) {
            $handle = 'hdd-react-app-entry-' . sanitize_key(basename($entry_file));
            wp_enqueue_script(
                $handle,
                $react_app_build_uri . $entry_file,
                array('wp-element'), // wp-element provides React and ReactDOM for WP context if needed
                filemtime( $react_app_build_path . $entry_file ),
                true // Load in footer
            );
            $script_handles[] = $handle;
        }
    } else { // Fallback to files if entrypoints not in manifest
        $js_dependency_handle = 'wp-element'; // Start with wp-element as a base dependency
        foreach ($js_files as $index => $js_file_path) {
            $handle = 'hdd-react-app-script-' . $index;
            wp_enqueue_script(
                $handle,
                $react_app_build_uri . ltrim($js_file_path, '/'),
                array($js_dependency_handle),
                filemtime( $react_app_build_path . ltrim($js_file_path, '/') ),
                true
            );
            $js_dependency_handle = $handle; // Chain dependencies for subsequent scripts
             $script_handles[] = $handle;
        }
    }

}
add_action( 'admin_enqueue_scripts', 'hdd_enqueue_react_app_assets' );

?>