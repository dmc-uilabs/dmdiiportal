package com.ge.research.vehicleforge.seleniumtests;

import static org.junit.Assert.assertEquals;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class AddProjectFromMyProjectsPageTest extends BaseTest {
	WebDriverWait wait = new WebDriverWait(driver, 30);
	JavascriptExecutor jse = (JavascriptExecutor) driver;
	
	@Test
	public void addProjectFromMyProjectsPageTest() throws Exception{
		// TODO Auto-generated constructor stub
		//Test Projects -> My Projects
	    Thread.sleep(2000);
	    driver.findElement(By.xpath("//div[2]/div/div/div/div/md-menu[2]/button")).click();
	    wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item/a/span"))).click();
	    assertEquals("My Projects", driver.getTitle());
	    
	    driver.findElement(By.xpath("//md-toolbar/div/a/span")).click();
	    
	    AddProjectFunctionalityTest addProject = new AddProjectFunctionalityTest();
	    addProject.addProjectFunctionalityTest();
	    
	}
}
