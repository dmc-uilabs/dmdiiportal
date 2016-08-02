package com.ge.research.vehicleforge.seleniumtests;
import static org.junit.Assert.assertEquals;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class DeleteProjectTest extends BaseTest{
	WebDriverWait wait = new WebDriverWait(driver, 30);
	JavascriptExecutor jse = (JavascriptExecutor) driver;
	@Test
	public void deleteProjectTest() throws Exception {	
		Thread.sleep(2000);
	    driver.findElement(By.xpath("//div[2]/div/div/div/div/md-menu[2]/button")).click();
	    wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item[1]/a/span"))).click();
	    assertEquals("My Projects", driver.getTitle());
		
		/*String url2 = "https://ben-web.opendmc.org/project.php#/11/home";
		driver.get(url2);*/
		
	    
	    driver.findElement(By.xpath("//md-toolbar/div/a/span")).click();
		AddProjectFunctionalityTest addProject = new AddProjectFunctionalityTest();
		addProject.addProjectFunctionalityTest();
		
		Thread.sleep(2000);
		//click "edit" button
		driver.findElement(By.xpath("html/body/div[2]/ui-view/div[1]/md-toolbar/div/a[1]")).click();
		//click "Delete Project"
		driver.findElement(By.xpath("html/body/div[2]/ui-view/div/div/div/div[1]/md-toolbar/div/button")).click();
		//choose No
		driver.findElement(By.xpath("html/body/div[6]/md-dialog/div/button[1]")).click();
		Thread.sleep(2000);
		//click "Delete Project"
		driver.findElement(By.xpath("html/body/div[2]/ui-view/div/div/div/div[1]/md-toolbar/div/button")).click();
		//choose Yes
		driver.findElement(By.xpath("html/body/div[6]/md-dialog/div/button[2]")).click();
		
	}

}
