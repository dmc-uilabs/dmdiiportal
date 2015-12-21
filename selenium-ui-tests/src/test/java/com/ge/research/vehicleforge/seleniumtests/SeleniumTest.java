package com.ge.research.vehicleforge.seleniumtests;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.html.DomText;
import org.junit.Ignore;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;

import java.util.List;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

/**
 * Created by 200005921 on 12/16/2015.
 */
public class SeleniumTest {

    public static final String BASE_URL = "http://ec2-52-34-47-123.us-west-2.compute.amazonaws.com/";
    public static final String DMC_TITLE_TEXT = "Digital Manufacturing Commons";

    @Ignore
    @Test
    public void testHtmlDriverWithJavascript () {
        HtmlUnitDriver driver = null;
        boolean useJavascrpt = true;

        driver = new HtmlUnitDriver(useJavascrpt);
        driver.manage().deleteAllCookies();
        driver.get(BASE_URL);
        // fails: net.sourceforge.htmlunit.corejs.javascript.EcmaError: TypeError: Cannot find function addEventListener in object

        WebElement titleElement = driver.findElementByXPath("/html/head/title");
        assertTrue(titleElement != null);


    }

    @Test
    public void testHtmlDriverWithoutJavascript () {
        HtmlUnitDriver driver = null;
        boolean useJavascrpt = false;

        driver = new HtmlUnitDriver(useJavascrpt);
        driver.manage().deleteAllCookies();
        driver.get(BASE_URL);

        WebElement titleElement = null;
        try {
            titleElement = driver.findElementByXPath("/html/head/title[text() = 'Digital Manufacturing Commons']");

        } catch (Exception ex) {
            fail("Title element not found!");
        }
        assertTrue(titleElement != null);

    }

    @Ignore
    @Test
    public void testDashboardAndReturn () {
        BrowserVersion version = BrowserVersion.CHROME;

        HtmlUnitDriver driver = null;
        boolean useJavascrpt = true;

        driver = new HtmlUnitDriver(version);
        driver.setJavascriptEnabled(useJavascrpt);
        driver.manage().deleteAllCookies();
        driver.get(BASE_URL);

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

        // WORKS UP TO HERE

        // Find link to go back
        // /html/body/div[1]/header/md-toolbar/div[1]/div[1]/a
        WebElement dmcHome = null;
        try {
            // This finds: <a href="{{p.href}}" class="home-feature">
            // Note that the script has not executed
            dmcHome = driver.findElementByXPath("/html/body/div[1]/header/md-toolbar/div[1]/div[1]/a");

        } catch (Exception ex) {
            fail("DMC Home element not found!");
        }
        assertTrue(dmcHome != null);
        dmcHome.click();
        currentURL = driver.getCurrentUrl();
        assertTrue (currentURL != null);
        assertTrue (currentURL.endsWith("index.php"));
    }

    @Test
    public void testDashboard () {
        BrowserVersion version = BrowserVersion.CHROME;

        HtmlUnitDriver driver = null;
        boolean useJavascrpt = true;

        driver = new HtmlUnitDriver(version);
        driver.setJavascriptEnabled(useJavascrpt);
        driver.manage().deleteAllCookies();
        driver.get(BASE_URL);

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
        BrowserVersion version = BrowserVersion.CHROME;

        HtmlUnitDriver driver = null;
        boolean useJavascrpt = true;

        driver = new HtmlUnitDriver(version);
        driver.setJavascriptEnabled(useJavascrpt);
        driver.manage().deleteAllCookies();
        driver.get(BASE_URL);

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
