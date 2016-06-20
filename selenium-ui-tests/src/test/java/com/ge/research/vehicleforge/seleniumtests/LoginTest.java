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
public class LoginTest extends BaseTest {

	
	@Test
	public void testLogin() throws Exception{
		testDMCLogin();	
	}


}
