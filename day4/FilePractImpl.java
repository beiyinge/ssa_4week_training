import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

public class FilePractImpl implements FilePractIF {
	
	public static void main(String[] args) {
		
		String fileName ="c:\\temp\\test.html";
		
		String fileNameNew ="c:\\temp\\testNew.html";
		
		FilePractIF ff = new FilePractImpl();
		
		//ff.readFile();
		//ff.readAFileOneLineAtTime();
		
		try{
			ff.upperWriter(fileNameNew);
			ff.doSomething(ff);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			
			e.printStackTrace();
		}

	}
	
	public void doSomething(FilePractIF fileWriter){
		try {
			if ( fileWriter instanceof FilePractImpl) {
			  System.out.println("in FilePractImpl");
			} 
		}catch (Exception e) {
			
		}
			//else if 
		
	}
	public void upperWriter (String fileName) throws Exception{
		
		List<String> strList = new ArrayList();
		strList.add("load");
		strList.add("an");
		strList.add("then");
		strList.add("down");
		
		File file = new File(fileName);

		// if file doesnt exists, then create it
		if (!file.exists()) {
			file.createNewFile();
		}
		
		FileWriter fw = new FileWriter(file.getAbsoluteFile());
		BufferedWriter bw = new BufferedWriter(fw);
		
		for ( String strTemp : strList) {
			System.out.print("\n"+strTemp.toUpperCase());
			bw.write(strTemp.toUpperCase() + System.lineSeparator());
		}
		

		
		bw.close();
	}
	//read file
		public void readFile (String fileName){
			
		    
			Path wiki_path = Paths.get(fileName);

		    Charset charset = Charset.forName("ISO-8859-1");
		    try {
		      List<String> lines = Files.readAllLines(wiki_path, charset);

		      for (String line : lines) {
		        System.out.println(line);
		        
		        
		            }
		    } catch (IOException e) {
		      System.out.println(e);
		    }

		
	   }

}
