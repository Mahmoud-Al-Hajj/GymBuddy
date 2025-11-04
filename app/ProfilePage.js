import Button from "../../components/Button.js";
import TextInput from "../components/TextInput.js";

async function ProfilePage() {
  const handleEditProfile = async () => {
    const username = SecureStore.getItemAsync("userEmail").trim().split("@")[0];
    const gender = await SecureStore.getItemAsync("userGender");
    const age = await SecureStore.getItemAsync("userAge");
    const weight = await SecureStore.getItemAsync("userWeight");

    console.log("Username:", username);
    console.log("Gender:", gender);
    console.log("Age:", age);
    console.log("Weight:", weight);

    //editing info after user input
    await SecureStore.setItemAsync("userEmail", `${username}@example.com`);
    await SecureStore.setItemAsync("userGender", gender);
    await SecureStore.setItemAsync("userAge", age.toString());
    await SecureStore.setItemAsync("userWeight", weight.toString());
  };

  return (
    <View>
      <Text>Profile Page</Text>
      <Text>Welcome to your profile!</Text>
      <Text>Here you can view and edit your personal information.</Text>
      <TextInput
        label="Username"
        placeholder="Enter your username"
        placeholderTextColor="#fff"
        value={values.username}
        onChangeText={handleChange("username")}
        onBlur={handleBlur("username")}
        error={errors.username}
        keyboardType="default"
        color={Colors.primary}
      />
      <TextInput
        label="Gender"
        placeholder="Enter your gender"
        placeholderTextColor="#fff"
        value={values.gender}
        onChangeText={handleChange("gender")}
        onBlur={handleBlur("gender")}
        error={errors.gender}
        keyboardType="default"
        color={Colors.primary}
      />
      <TextInput
        label="Age"
        placeholder="Enter your age"
        placeholderTextColor="#fff"
        value={values.age}
        onChangeText={handleChange("age")}
        onBlur={handleBlur("age")}
        error={errors.age}
        keyboardType="numeric"
        color={Colors.primary}
      />
      <TextInput
        label="Weight"
        placeholder="Enter your weight"
        placeholderTextColor="#fff"
        value={values.weight}
        onChangeText={handleChange("weight")}
        onBlur={handleBlur("weight")}
        error={errors.weight}
        keyboardType="numeric"
        color={Colors.primary}
      />
      <Button
        label="Edit Profile"
        onPress={handleEditProfile}
        style={styles.buttonStyle}
        textStyle={styles.textStyle}
      />
    </View>
  );
}
export default ProfilePage;
