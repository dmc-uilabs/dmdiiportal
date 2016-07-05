package com.ge.research.vehicleforge.seleniumtests;

import static org.junit.Assert.assertEquals;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

import org.junit.Test;
import org.junit.Ignore;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class AddProjectTest extends BaseTest{
	
	private static Logger LOGGER = Logger.getLogger("InfoLogging");
	
	static Integer projectNum =TestUtils.ran;
	static String projectName = "Test Project " + projectNum;
	static String overview = "This is a test for adding project" + projectNum;
	static String ProjectTag = "Test tag" + projectNum;
	static String overviewEdit = "This is a test for editing project" + projectNum;
	static String ProjectTagEdit = "Test tag edited" + projectNum;

	//Navigate from MyAccount Menu
	public static void accountProjectNav() throws Exception{
		WebDriverWait wait = new WebDriverWait(driver, 30);
		testPublicLoginProtection();
		
		driver.findElement(By.xpath("//div[3]/md-menu/button")).click();
		WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item[3]/a/span")));
        element.click();	    
	    System.out.println("Get current title:" + driver.getTitle());
	    assertEquals("My Projects", driver.getTitle());
	}
	
	
	@Test
	public void runTestAddProject() throws Exception{
		testAddProject();
	}
	
	
	public static void testAddProject() throws Exception{
		testDMCLogin();
		WebDriverWait wait = new WebDriverWait(driver, 30);
		accountProjectNav();
		driver.findElement(By.xpath("//md-toolbar/div/a/span")).click();
		//WebElement e = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("input_5")));
		WebElement e = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//md-content/form/md-input-container/input")));
		e.clear();
		e.sendKeys(projectName);
		
		//select due date
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
		driver.findElement(By.xpath("//md-datepicker/button")).click();
		String[] currentDate = (new SimpleDateFormat("yyyy-mm-dd")).format(new Date()).split("-");
		driver.findElement(By.xpath("//tbody[4]/tr[5]/td[3]/span")).click();
	    //select type
	    driver.findElement(By.id("select_11")).click();
	    driver.findElement(By.xpath("//md-option/div[1]")).click();
	    //add overview
	   
	    driver.findElement(By.id("input_12")).clear();
	    driver.findElement(By.id("input_12")).sendKeys(overview);
	    //add tag
	    driver.findElement(By.id("input_13")).clear();
	    driver.findElement(By.id("input_13")).sendKeys(ProjectTag);
	    wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-content[2]/div/form/button"))).click();
	    //driver.findElement(By.xpath("//md-content[2]/div/form/button")).click();
	    
	    //next to add member
	    JavascriptExecutor jse = (JavascriptExecutor)driver;
		WebElement next = driver.findElement(By.xpath("//ap-tab-one/div/div[2]/button"));
		jse.executeScript("arguments[0].scrollIntoView(true);", next);
		//System.out.println("NEXT is enable or disabled: " + next.isEnabled());
		if(next.isEnabled()){
			next.sendKeys(Keys.ENTER);;
		}else{
			//System.out.println("Can not click the button NEXT!!!");
			LOGGER.info("The button NEXT is not clickable!");
		}

		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
		// Invite members to this project
	    driver.findElement(By.xpath("//div[2]/dmc-add-members-card/div/div[5]/button")).click();
	    driver.findElement(By.xpath("//div[3]/dmc-add-members-card/div/div[5]/button")).click();
	    
	    //submit to create the new project
	    driver.findElement(By.xpath("//div[2]/button[2]")).click();
	}
	
	@Ignore
	@Test
	public void editProjectTest() throws Exception{
		testDMCLogin();
		WebDriverWait wait = new WebDriverWait(driver, 30);
		driver.get(baseUrl + "/my-projects.php#/");
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
		
		WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.linkText(projectName)));
		//WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.linkText("Test Project65549")));
        element.click();
        
	    driver.findElement(By.linkText("Edit")).click();	    
	    driver.findElement(By.id("input_12")).clear();
	    driver.findElement(By.id("input_12")).sendKeys(overviewEdit);
	    //add tag
	    driver.findElement(By.id("input_13")).clear();
	    driver.findElement(By.id("input_13")).sendKeys(ProjectTagEdit);
	    wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-content[2]/div/form/button"))).click();
	    //driver.findElement(By.xpath("//md-content[2]/div/form/button")).click();
	    
	    //next to add member
	    JavascriptExecutor jse = (JavascriptExecutor)driver;
		WebElement next = driver.findElement(By.xpath("//ap-tab-one/div/div[2]/button"));
		jse.executeScript("arguments[0].scrollIntoView(true);", next);
		//System.out.println("NEXT is enable or disabled: " + next.isEnabled());
		if(next.isEnabled()){
			next.sendKeys(Keys.ENTER);;
		}else{
			System.out.println("Can not click the button NEXT!!!");
		}

		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);

	    //submit to create the new project
	    driver.findElement(By.xpath("//div[2]/button[2]")).click();
		
	}
	
	

	
}
