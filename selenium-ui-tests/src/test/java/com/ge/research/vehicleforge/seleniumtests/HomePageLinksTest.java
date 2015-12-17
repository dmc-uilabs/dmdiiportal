package com.ge.research.vehicleforge.seleniumtests;

import static org.junit.Assert.fail;
import static org.junit.Assert.assertTrue;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;

/**
 * @author Amine Chigani
 *
 * Unit tests for navigating through the Home page of the site
 * clicking each link and checking whether the correct page is loaded.
 */
public class HomePageLinksTest extends BaseTest {


    @Test
    public void testDashboard () {

        driver.get(baseUrl);

        WebElement titleElement = null;
        try {
            titleElement = driver.findElementByXPath("/html/head/title[text() = 'Digital Manufacturing Commons']");

        } catch (Exception ex) {
            fail("Title element not found!");
        }
        assertTrue(titleElement != null);

        // Click on dashboard link
        // /html/body/div[2]/div[1]/a/button
        WebElement dashboardViewButton = null;
        try {
            // This finds: <a href="{{p.href}}" class="home-feature">
            // Note that the script has not executed
            dashboardViewButton = driver.findElementByXPath("/html/body/div[2]/div[1]/a[1]/button");

        } catch (Exception ex) {
            fail("Dashboard element not found!");
        }
        assertTrue(dashboardViewButton != null);
        dashboardViewButton.click();
        String currentURL = driver.getCurrentUrl();
        assertTrue (currentURL != null);
        assertTrue (currentURL.endsWith("dashboard.php"));

    }

    @Test
    public void testMarketplace () {

        driver.get(baseUrl);

        WebElement titleElement = null;
        try {
            titleElement = driver.findElementByXPath("/html/head/title[text() = 'Digital Manufacturing Commons']");

        } catch (Exception ex) {
            fail("Title element not found!");
        }
        assertTrue(titleElement != null);

        // Click on dashboard link
        // /html/body/div[2]/div[1]/a/button
        WebElement dashboardViewButton = null;
        try {
            // This finds: <a href="{{p.href}}" class="home-feature">
            // Note that the script has not executed
            dashboardViewButton = driver.findElementByXPath("/html/body/div[2]/div[2]/a[1]/button");

        } catch (Exception ex) {
            fail("Dashboard element not found!");
        }
        assertTrue(dashboardViewButton != null);
        dashboardViewButton.click();
        String currentURL = driver.getCurrentUrl();
        assertTrue (currentURL != null);
        assertTrue (currentURL.indexOf("marketplace.php") > 0);

    }


}
