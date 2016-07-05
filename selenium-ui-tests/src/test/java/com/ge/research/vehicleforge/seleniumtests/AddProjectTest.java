package com.ge.research.vehicleforge.seleniumtests;

import static org.junit.Assert.assertEquals;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
		String[] currentDate = (new SimpleDateFormat("yyyy-MM-dd")).format(new Date()).split("-");
		String regex = "^0*";
		currentDate[1] = currentDate[1].matches(regex) ? currentDate[1].substring(1) : currentDate[1];
		String substitutedDate = currentDate[0] + "-" + currentDate[1] + "-" + currentDate[2];
		log.log(Level.INFO, "addProjectTest, xpath is " + "//td[@id='md-0-"+ substitutedDate + "']/span");
		driver.findElement(By.xpath("//tbody[2]/tr[2]/td[2]/span")).click();
	    //select type
	    driver.findElement(By.xpath("/html/body/div[2]/div/div/div/div[2]/md-content/md-tabs/"
	    		+ "md-tabs-content-wrapper/md-tab-content[1]/div/md-content/ap-tab-one/div/div[1]/"
	    		+ "div[1]/div/div[2]/md-content[1]/form/div/md-input-container[2]/md-select")).click();
	    //driver.findElement(By.xpath("//md-select-value[@id='select_value_label_3']/span[2]")).click();
	    driver.findElement(By.xpath("//md-option[2]/div")).click();
	    //add overview
	   
	    driver.findElement(By.name("overview")).clear();
	    driver.findElement(By.name("overview")).sendKeys(overview);
	    //add tag
	   
	    driver.findElement(By.xpath("//md-content[2]/div/form/md-input-container/input")).clear();
	    driver.findElement(By.xpath("//md-content[2]/div/form/md-input-container/input")).sendKeys(ProjectTag);
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
		WebElement firstMember = driver.findElement(By.xpath("//div[2]/dmc-add-members-card/div/div[5]/button"));
		jse.executeScript("arguments[0].scrollIntoView(true);", firstMember);
		firstMember.sendKeys(Keys.ENTER);
		WebElement secondMember = driver.findElement(By.xpath("//div[3]/dmc-add-members-card/div/div[5]/button"));
		jse.executeScript("arguments[0].scrollIntoView(true);", secondMember);
		secondMember.sendKeys(Keys.ENTER);
	    
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
